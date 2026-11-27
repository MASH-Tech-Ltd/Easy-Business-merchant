'use client';

import { useEffect, useState } from 'react';
import { HardDrive, Image as ImageIcon, Globe, CheckCircle2, Clock, Send, X, Loader2, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/utils/api';
import { MFSLogo } from '@/components/MFSLogo';

const CATEGORY_META: Record<string, { label: string; icon: any; badge: string }> = {
  storage: { label: 'Image Storage', icon: HardDrive, badge: 'bg-indigo-50 text-indigo-700' },
  image_bandwidth: { label: 'Image Bandwidth', icon: ImageIcon, badge: 'bg-emerald-50 text-emerald-700' },
  general_bandwidth: { label: 'General Traffic', icon: Globe, badge: 'bg-blue-50 text-blue-700' },
};

export default function ResourceAddonsSection({ platformAccounts = [] }: { platformAccounts?: any[] }) {
  const [addons, setAddons] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAddon, setModalAddon] = useState<any | null>(null);
  const [customQtyById, setCustomQtyById] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [provider, setProvider] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [aRes, pRes] = await Promise.all([
        api.get('/resources/addons'),
        api.get('/resources/addons/my-purchases'),
      ]);
      setAddons(aRes.data?.data || []);
      setPurchases(pRes.data?.data || []);
    } catch {
      // silent if no active subscription yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeAccounts = platformAccounts.filter((a) => a.isActive !== false);

  const formatTotalBytes = (bytes: number) => {
    const GB = 1024 * 1024 * 1024;
    const MB = 1024 * 1024;
    if (bytes >= GB) return `${(bytes / GB).toFixed(bytes % GB === 0 ? 0 : 2)} GB`;
    return `${Math.round(bytes / MB)} MB`;
  };

  const stepQty = (a: any, delta: number) => {
    const minQ = a.isCustomQuantity ? Math.max(1, a.minQuantity || 1) : 1;
    const maxQ = Math.max(minQ, a.remainingPurchasable || minQ);
    const cur = customQtyById[a.id] ?? minQ;
    const next = Math.max(minQ, Math.min(maxQ, cur + delta));
    setCustomQtyById((prev) => ({ ...prev, [a.id]: next }));
  };

  const openBuy = (addon: any) => {
    const minQ = addon.isCustomQuantity ? Math.max(1, addon.minQuantity || 1) : 1;
    const chosen = customQtyById[addon.id] ?? minQ;
    const clamped = Math.max(minQ, Math.min(addon.remainingPurchasable || minQ, chosen));
    setModalAddon(addon);
    setQuantity(clamped);
    setProvider(activeAccounts[0]?.provider || 'bKash');
    setSenderNumber('');
    setTransactionId('');
    setNote('');
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAddon) return;
    setSubmitting(true);
    try {
      await api.post('/resources/addons/purchase', {
        addonId: modalAddon.id,
        quantity,
        payment: { provider, senderNumber, transactionId, note: note || undefined },
      });
      toast.success('Resource add-on payment submitted! It will activate once verified by Admin.');
      setModalAddon(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Purchase submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || (addons.length === 0 && purchases.length === 0)) return null;

  return (
    <div className="space-y-5 mt-8 pt-8 border-t border-gray-200">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Storage &amp; Bandwidth Add-ons</h2>
        <p className="text-xs text-gray-500">
          Purchase extra image storage, image CDN bandwidth, or general traffic capacity configured by the platform.
        </p>
      </div>

      {addons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map((a) => {
            const meta = CATEGORY_META[a.category] || CATEGORY_META.storage;
            const Icon = meta.icon;
            const minQ = a.isCustomQuantity ? Math.max(1, a.minQuantity || 1) : 1;
            const soldOut = a.remainingPurchasable < minQ;
            const qty = a.isCustomQuantity ? Math.max(minQ, Math.min(a.remainingPurchasable || minQ, customQtyById[a.id] ?? minQ)) : 1;
            const totalBytes = a.quantityBytes * qty;
            const totalPrice = Math.round(a.effectivePrice * qty * 100) / 100;
            const minBytesLabel = formatTotalBytes(a.quantityBytes * minQ);
            const maxBytesLabel = formatTotalBytes(a.quantityBytes * Math.max(minQ, a.remainingPurchasable));
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between gap-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.badge}`}>
                      <Icon className="w-3.5 h-3.5" /> {meta.label}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      +{formatTotalBytes(totalBytes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{a.name}</h3>
                    {a.isCustomQuantity && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Custom
                      </span>
                    )}
                  </div>
                  {a.description && <p className="text-xs text-gray-500">{a.description}</p>}

                  {a.isCustomQuantity && !soldOut && (
                    <div className="pt-2 space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-gray-600">
                          Amount ({minBytesLabel} – {maxBytesLabel})
                        </span>
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={qty <= minQ}
                            onClick={() => stepQty(a, -1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center text-gray-700 cursor-pointer"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-[74px] text-center text-xs font-bold text-gray-900">
                            {formatTotalBytes(totalBytes)}
                          </span>
                          <button
                            type="button"
                            disabled={qty >= a.remainingPurchasable}
                            onClick={() => stepQty(a, 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center text-gray-700 cursor-pointer"
                            aria-label="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>Step: +{a.displayQuantity} {a.displayUnit}</span>
                        <span className="font-bold text-indigo-700">Price: ৳{totalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-extrabold text-gray-900">৳{totalPrice}</span>
                    {!a.isCustomQuantity && a.promoPrice != null && a.promoPrice < a.price && (
                      <span className="ml-1.5 text-xs text-gray-400 line-through">৳{a.price}</span>
                    )}
                    {a.isCustomQuantity && (
                      <span className="ml-1.5 text-[11px] text-gray-500">
                        (৳{a.effectivePrice} / {a.displayQuantity} {a.displayUnit})
                      </span>
                    )}
                    <div className="text-[11px] text-gray-400 capitalize">{a.durationType.replace('_', ' ')}</div>
                  </div>
                  <button
                    type="button"
                    disabled={soldOut}
                    onClick={() => openBuy(a)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    {soldOut ? 'Max Limit Reached' : 'Purchase'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {purchases.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Resource Add-on Purchase History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-2 pr-3">Add-on</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map((p) => (
                  <tr key={p._id}>
                    <td className="py-2 pr-3 font-semibold">{p.snapshot?.name}</td>
                    <td className="py-2 pr-3">{p.quantity}</td>
                    <td className="py-2 pr-3 font-bold">৳{p.totalPrice}</td>
                    <td className="py-2 pr-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold capitalize ${
                        p.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : 'Permanent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {modalAddon && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handlePurchase} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Purchase {modalAddon.name}</h3>
                <p className="text-xs text-gray-500">
                  +{modalAddon.displayQuantity * quantity} {modalAddon.displayUnit} &bull; Total{' '}
                  <strong>৳{modalAddon.effectivePrice * quantity}</strong>
                </p>
              </div>
              <button type="button" onClick={() => setModalAddon(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeAccounts.length > 0 && (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {activeAccounts.map((acc: any) => (
                  <div key={acc.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MFSLogo provider={acc.provider} className="w-6 h-6" />
                      <div>
                        <div className="font-bold text-gray-800">{acc.provider} ({acc.type})</div>
                        <div className="text-gray-600">{acc.accountNumber}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Quantity {modalAddon.isCustomQuantity ? `(min ${modalAddon.minQuantity || 1})` : ''}
                </label>
                <input
                  type="number"
                  min={modalAddon.isCustomQuantity ? modalAddon.minQuantity || 1 : 1}
                  max={modalAddon.remainingPurchasable}
                  value={quantity}
                  onChange={(e) => {
                    const minQ = modalAddon.isCustomQuantity ? modalAddon.minQuantity || 1 : 1;
                    setQuantity(Math.max(minQ, Math.min(modalAddon.remainingPurchasable, Number(e.target.value) || minQ)));
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Payment Method</label>
                <input
                  required
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Sender Number</label>
              <input
                required
                type="text"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Transaction ID (TrxID)</label>
              <input
                required
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter TrxID"
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Payment (৳{modalAddon.effectivePrice * quantity})
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
