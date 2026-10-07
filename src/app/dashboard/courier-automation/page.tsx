"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Settings,
  Play,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { COURIER_PROVIDERS } from "@/config/couriers";

export default function CourierAutomation() {
  const [activeProvider, setActiveProvider] = useState("pathao");
  const [clientId, setClientId] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [autoForward, setAutoForward] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [storedConfig, setStoredConfig] = useState<Record<string, any>>({});
  const [showSecret, setShowSecret] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalCouriers, setGlobalCouriers] = useState<any[] | null>(null);

  const providers = globalCouriers ? COURIER_PROVIDERS.map(p => {
    const gc = globalCouriers.find(g => g.id === p.id);
    return { ...p, isActive: gc ? gc.isActive : true, badge: gc ? gc.badge : 'none', message: gc ? gc.message : '' };
  }) : [];

  const applyConfig = (pConfig: any) => {
    setClientId(pConfig?.clientId || "");
    setApiSecret(pConfig?.apiSecret || "");
    setUsername(pConfig?.username || "");
    setPassword(pConfig?.password || "");
    setAutoForward(pConfig?.autoForward || false);
    setIsActive(pConfig?.isActive || false);
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Always fetch fresh global settings
        const globalRes = await api.get("/system/public-settings");
        let activeProvidersList: any[] = [];
        if (globalRes.data?.status === "ok" && globalRes.data.data?.couriers) {
          activeProvidersList = globalRes.data.data.couriers;
          setGlobalCouriers(activeProvidersList);
        }

        const res = await api.get("/courier/my-charges");
        if (res.data?.status === "ok" && res.data.data) {
          const data = res.data.data;
          let configs: Record<string, any> = {};
          let configured: string[] = [];

          if (data.providers) {
            configs = data.providers;
            configured = Object.keys(data.providers).filter(
              (k) => data.providers[k]?.isActive && data.providers[k]?.clientId,
            );
          } else if (data.provider) {
            configured.push(data.provider);
            configs[data.provider] = {
              clientId: data.clientId,
              apiSecret: data.apiSecret,
              autoForward: data.autoForward,
              isActive: true,
            };
          }

          setStoredConfig(configs);
          setConfiguredProviders(configured);

          let active = "pathao";
          if (data.provider && configs[data.provider]) active = data.provider;

          // Ensure the chosen active provider is globally active
          const activeGlobal = activeProvidersList.find(g => g.id === active);
          if (activeGlobal && activeGlobal.isActive === false) {
            // Find the first globally active provider
            const firstActive = COURIER_PROVIDERS.find(p => {
              const g = activeProvidersList.find(gInfo => gInfo.id === p.id);
              return g ? g.isActive !== false : true;
            });
            if (firstActive) active = firstActive.id;
          }

          setActiveProvider(active);
          applyConfig(configs[active] || {});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        provider: activeProvider,
        clientId,
        apiSecret,
        autoForward,
        isActive,
      };

      // For Pathao: all fields are returned decrypted, so always include username/password
      if (activeProvider === "pathao") {
        if (username) payload.username = username;
        if (password) payload.password = password;
      }

      await api.post("/courier/credentials", payload);
      toast.success("Configuration saved successfully!");

      if (isActive) {
        setConfiguredProviders((prev) =>
          !prev.includes(activeProvider) ? [...prev, activeProvider] : prev,
        );
      } else {
        setConfiguredProviders((prev) =>
          prev.filter((p) => p !== activeProvider),
        );
      }

      // Re-fetch to get the new masked values
      const res = await api.get("/courier/my-charges");
      if (res.data?.status === "ok" && res.data.data) {
        const data = res.data.data;
        let configs: Record<string, any> = {};

        if (data.providers) {
          configs = data.providers;
        } else if (data.provider) {
          configs[data.provider] = {
            clientId: data.clientId,
            apiSecret: data.apiSecret,
            autoForward: data.autoForward,
          };
        }

        setStoredConfig(configs);
        applyConfig(configs[activeProvider] || {});
      }
    } catch (error) {
      toast.error("Failed to save configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 w-full max-w-[1800px] mx-auto min-h-[calc(100vh-64px)] space-y-4 sm:space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#5022C3]" /> Courier Automation
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Configure automated order forwarding to your preferred delivery
            partners.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="bg-[#5022C3] hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Start Automation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6 gap-4">
        <div className="lg:col-span-1 space-y-3">
          {globalCouriers === null ? (
            <div className="flex justify-center py-10">
              <RefreshCw className="w-6 h-6 text-[#5022C3] animate-spin" />
            </div>
          ) : providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                if (provider.isActive === false) {
                  toast(provider.message || 'It will be available very soon', { icon: '🔒' });
                  return;
                }
                setActiveProvider(provider.id);
                applyConfig(storedConfig[provider.id] || {});
              }}
              className={`relative w-full flex items-center gap-3 p-3 sm:p-4 pr-8 sm:pr-10 rounded-xl border transition-all ${
                provider.isActive === false
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : activeProvider === provider.id
                  ? "border-[#5022C3] bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1 flex-shrink-0">
                {provider.icon ? (
                  <img src={provider.icon} alt={provider.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="font-bold text-xs text-gray-500">
                    {provider.name}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm truncate ${activeProvider === provider.id ? "text-[#5022C3]" : "text-gray-900"}`}
                  >
                    {provider.name}
                  </span>
                  {provider.badge === 'new' && (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                      NEW
                    </span>
                  )}
                  {provider.badge === 'beta' && (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                      BETA
                    </span>
                  )}
                </div>
                
                <div className="mt-0.5 flex items-center">
                  {provider.isActive === false ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      Temporarily Unavailable
                    </div>
                  ) : configuredProviders.includes(provider.id) ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Configured & Ready
                    </div>
                  ) : storedConfig[provider.id]?.clientId ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      Configured (Inactive)
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      Not Configured
                    </div>
                  )}
                </div>
              </div>
              {activeProvider === provider.id && (
                <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-5 h-5 text-[#5022C3]" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {providers.find(p => p.id === activeProvider)?.isActive === false ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <EyeOff className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {providers.find(p => p.id === activeProvider)?.name} is currently unavailable
              </h3>
              <p className="text-gray-500 max-w-md">
                {providers.find(p => p.id === activeProvider)?.message || 'This courier integration is temporarily disabled or coming soon.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900 capitalize">
                    {activeProvider} Configuration
                  </h3>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${isActive ? "bg-[#5022C3]" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? "transform translate-x-4" : ""}`}
                    ></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">
                    {isActive ? "Active" : "Inactive"}
                  </div>
                </label>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeProvider === "steadfast"
                      ? "API key (Leave blank to keep existing)"
                      : "Client ID (Leave blank to keep existing)"}
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5022C3] focus:outline-none"
                    placeholder={
                      activeProvider === "steadfast"
                        ? "Enter API key"
                        : "Enter Client ID"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeProvider === "steadfast"
                      ? "Secret key (Leave blank to keep existing)"
                      : "Client Secret (Leave blank to keep existing)"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5022C3] focus:outline-none"
                      placeholder="••••••••••••shme"
                    />
                  </div>
                </div>

                {/* Pathao-only: Account credentials for OAuth token generation */}
                {activeProvider === "pathao" && (
                  <div className="border border-amber-100 bg-amber-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs text-amber-700 font-medium">
                      🔐 Your Pathao account login — used to auto-generate access
                      tokens. Stored encrypted & never shared.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pathao Account Email (Leave blank to keep existing)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5022C3] focus:outline-none bg-white"
                          placeholder="yo••••••@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pathao Account Password (Leave blank to keep existing)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5022C3] focus:outline-none bg-white"
                          placeholder="••••••••••••shme"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoForward}
                      onChange={(e) => setAutoForward(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#5022C3] focus:ring-[#5022C3]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Auto-forward orders on confirmation
                    </span>
                  </label>
                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {loading ? "Saving..." : "Save Details"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
