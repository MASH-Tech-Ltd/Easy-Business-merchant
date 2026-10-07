import React, { useState, useEffect } from 'react';
import { X, Truck, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

import { COURIER_PROVIDERS } from '@/config/couriers';

interface CourierModalProps {
  orderId: string;
  configuredProviders: string[];
  providerDetails?: Record<string, { isConfigured: boolean; isActive: boolean }>;
  onClose: () => void;
  onForward: (orderId: string, providerId: string) => Promise<void>;
}

export function CourierModal({ orderId, configuredProviders = [], providerDetails = {}, onClose, onForward }: CourierModalProps) {
  const defaultProvider = configuredProviders.length > 0 ? configuredProviders[0] : 'pathao';
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [loading, setLoading] = useState(false);

  const [globalCouriers, setGlobalCouriers] = useState<any[]>([]);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const res = await api.get("/system/public-settings");
        if (res.data?.status === "ok" && res.data.data?.couriers) {
          setGlobalCouriers(res.data.data.couriers);
        }
      } catch (err) {
        console.error("Error fetching global settings:", err);
      }
    };
    fetchGlobalSettings();
  }, []);

  const providers = COURIER_PROVIDERS.map(p => {
    const gc = globalCouriers.find(g => g.id === p.id);
    return { ...p, isActive: gc ? gc.isActive : true, badge: gc ? gc.badge : 'none', message: gc?.message || '' };
  });

  const handleForward = async () => {
    setLoading(true);
    await onForward(orderId, selectedProvider);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-[#5022C3]">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900">Forward to Courier</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          <p className="text-sm text-gray-600">Select a courier to forward Order #{orderId.substring(orderId.length - 6).toUpperCase()}</p>
          
          <div className="space-y-3 mt-4">
            {providers.map((p: any) => {
              const isConfiguredAndActive = configuredProviders.includes(p.id);
              const isConfiguredButInactive = providerDetails[p.id]?.isConfigured && !providerDetails[p.id]?.isActive;
              const isDisabled = p.isActive === false || !isConfiguredAndActive;
              return (
                <label 
                  key={p.id}
                  onClick={(e) => {
                    if (p.isActive === false) {
                      e.preventDefault();
                      toast(p.message || 'It will be available very soon', { icon: '🔒' });
                    }
                  }}
                  className={`flex items-center gap-3 p-3 border rounded-xl transition-colors ${
                    p.isActive === false ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' :
                    !isConfiguredAndActive ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' :
                    selectedProvider === p.id ? 'border-[#5022C3] bg-purple-50 cursor-pointer' : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="provider" 
                    value={p.id}
                    disabled={isDisabled}
                    checked={selectedProvider === p.id}
                    onChange={() => !isDisabled && setSelectedProvider(p.id)}
                    className={`w-4 h-4 text-[#5022C3] focus:ring-[#5022C3] border-gray-300 ${isDisabled ? 'cursor-not-allowed' : ''}`}
                  />
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                    {p.icon ? (
                      <img src={p.icon} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="font-bold text-xs text-gray-500">{p.name}</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm truncate">
                        {p.name}
                      </span>
                      {p.badge === 'new' && (
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                          NEW
                        </span>
                      )}
                      {p.badge === 'beta' && (
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                          BETA
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex items-center">
                      {p.isActive === false ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          Temporarily Unavailable
                        </div>
                      ) : isConfiguredAndActive ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          Configured & Ready
                        </div>
                      ) : isConfiguredButInactive ? (
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
                </label>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleForward}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#5022C3] rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Forward Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
