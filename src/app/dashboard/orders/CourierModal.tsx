import React, { useState } from 'react';
import { X, Truck, Loader2 } from 'lucide-react';

import { COURIER_PROVIDERS } from '@/config/couriers';

interface CourierModalProps {
  orderId: string;
  configuredProviders: string[];
  onClose: () => void;
  onForward: (orderId: string, providerId: string) => Promise<void>;
}

export function CourierModal({ orderId, configuredProviders = [], onClose, onForward }: CourierModalProps) {
  const defaultProvider = configuredProviders.length > 0 ? configuredProviders[0] : 'pathao';
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [loading, setLoading] = useState(false);

  const providers = COURIER_PROVIDERS;

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
            {providers.map((p) => {
              const isConfigured = configuredProviders.includes(p.id);
              return (
                <label 
                  key={p.id}
                  className={`flex items-center gap-3 p-3 border rounded-xl transition-colors ${
                    !isConfigured ? 'opacity-50 cursor-not-allowed bg-gray-50' :
                    selectedProvider === p.id ? 'border-[#5022C3] bg-purple-50 cursor-pointer' : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="provider" 
                    value={p.id}
                    disabled={!isConfigured}
                    checked={selectedProvider === p.id}
                    onChange={() => isConfigured && setSelectedProvider(p.id)}
                    className={`w-4 h-4 text-[#5022C3] focus:ring-[#5022C3] border-gray-300 ${!isConfigured ? 'cursor-not-allowed' : ''}`}
                  />
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                    {p.icon ? (
                      <img src={p.icon} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="font-bold text-xs text-gray-500">{p.name}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                    {isConfigured ? (
                      <div className="text-[10px] text-green-600 font-medium">Configured & Ready</div>
                    ) : (
                      <div className="text-[10px] text-gray-500 font-medium">Not Configured</div>
                    )}
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
