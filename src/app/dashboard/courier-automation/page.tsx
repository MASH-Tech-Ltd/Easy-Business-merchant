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

  const providers = COURIER_PROVIDERS;

  const applyConfig = (pConfig: any) => {
    setClientId(pConfig?.clientId || "");
    setApiSecret(pConfig?.apiSecret || "");
    setUsername(pConfig?.username || "");
    setPassword(pConfig?.password || "");
    setAutoForward(pConfig?.autoForward || false);
    setIsActive(pConfig?.isActive || false);
  };

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
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
          else if (configured.length > 0) active = configured[0];

          setActiveProvider(active);
          applyConfig(configs[active] || {});
        }
      } catch (error) {
        console.error("Error fetching courier info:", error);
      }
    };
    fetchCredentials();
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                setActiveProvider(provider.id);
                applyConfig(storedConfig[provider.id] || {});
              }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                activeProvider === provider.id
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
              <span
                className={`font-semibold ${activeProvider === provider.id ? "text-[#5022C3]" : "text-gray-700"}`}
              >
                {provider.name}
              </span>
              {configuredProviders.includes(provider.id) && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  Configured
                </span>
              )}
              {activeProvider === provider.id && (
                <CheckCircle2 className="w-5 h-5 text-[#5022C3] ml-auto" />
              )}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
        </div>
      </div>
    </div>
  );
}
