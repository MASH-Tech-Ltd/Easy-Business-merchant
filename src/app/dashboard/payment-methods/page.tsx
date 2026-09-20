'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CreditCard, Banknote } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

interface ManualPaymentMethod {
  id: string;
  provider: string;
  type: string;
  number: string;
  instructions: string;
  isActive: boolean;
}

export default function PaymentMethodsPage() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [methods, setMethods] = useState<ManualPaymentMethod[]>([]);

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const res = await api.get('/tenants/my-store');
      if (res.data?.data) {
        setStore(res.data.data);
        const settings = res.data.data.settings || {};
        if (settings.manualPaymentMethods) {
          setMethods(settings.manualPaymentMethods);
        } else {
          // Add a default empty method if none exist
          handleAddMethod();
        }
      }
    } catch (error) {
      console.error('Failed to fetch store data', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = () => {
    setMethods([
      ...methods,
      {
        id: Math.random().toString(36).substring(7),
        provider: 'bKash',
        type: 'Personal',
        number: '',
        instructions: 'Please send money to this number and provide the Transaction ID.',
        isActive: true
      }
    ]);
  };

  const handleRemoveMethod = (id: string) => {
    setMethods(methods.filter(m => m.id !== id));
  };

  const handleChange = (id: string, field: keyof ManualPaymentMethod, value: any) => {
    setMethods(methods.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Validate
      const invalid = methods.some(m => !m.provider || !m.number || !m.type);
      if (invalid) {
        toast.error('Please fill in all required fields (Provider, Type, Number)');
        setSaving(false);
        return;
      }

      const payload = {
        'settings.manualPaymentMethods': methods
      };
      
      await api.patch('/tenants/update-store', payload);
      toast.success('Payment methods updated successfully');
      fetchStoreInfo();
    } catch (error: any) {
      console.error('Error updating keys', error);
      toast.error(error.response?.data?.message || 'Failed to update payment methods');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[1000px] mx-auto min-h-[calc(100vh-64px)]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Banknote className="w-6 h-6 text-[#5022C3]" /> Manual Payment Methods
          </h1>
          <p className="text-gray-500">
            Configure mobile banking and manual payment options for your customers. These details will be shown to customers after they place an order.
          </p>
        </div>
        <button
          onClick={handleAddMethod}
          className="bg-white border-2 border-[#5022C3] text-[#5022C3] hover:bg-purple-50 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Method
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {methods.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No payment methods configured</h3>
            <p className="text-gray-500 mb-6">Add your bKash, Nagad, or Rocket accounts to accept payments.</p>
            <button
              type="button"
              onClick={handleAddMethod}
              className="bg-[#5022C3] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#401a9c] transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add First Method
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {methods.map((method, index) => (
              <div key={method.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative group transition-all hover:border-purple-200">
                <div className="absolute top-4 right-4 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-600">Active</span>
                    <input
                      type="checkbox"
                      checked={method.isActive}
                      onChange={(e) => handleChange(method.id, 'isActive', e.target.checked)}
                      className="w-4 h-4 text-[#5022C3] rounded border-gray-300 focus:ring-[#5022C3]"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveMethod(method.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-6 pr-32">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Payment Account</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Provider <span className="text-red-500">*</span></label>
                    <select
                      value={method.provider}
                      onChange={(e) => handleChange(method.id, 'provider', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3] focus:border-transparent transition-all"
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Upay">Upay</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type <span className="text-red-500">*</span></label>
                    <select
                      value={method.type}
                      onChange={(e) => handleChange(method.id, 'type', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3] focus:border-transparent transition-all"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Agent">Agent</option>
                      <option value="Merchant">Merchant</option>
                      <option value="Current">Current (Bank)</option>
                      <option value="Savings">Savings (Bank)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. 017XXXXXXXX"
                      value={method.number}
                      onChange={(e) => handleChange(method.id, 'number', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions for Customer</label>
                  <textarea
                    rows={2}
                    placeholder="Enter instructions (e.g. Please use Send Money option and put your Order ID as reference)"
                    value={method.instructions}
                    onChange={(e) => handleChange(method.id, 'instructions', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3] focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {methods.length > 0 && (
          <div className="flex justify-center sm:justify-end w-full pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#5022C3] hover:bg-[#401a9c] text-white px-10 py-3.5 rounded-xl font-bold shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto text-lg"
            >
              <Save className="w-6 h-6" />
              {saving ? 'Saving...' : 'Save Payment Methods'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
