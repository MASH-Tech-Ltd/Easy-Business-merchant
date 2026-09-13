'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingBag, Package, ListTree, Users, Truck,
  Store, BarChart2, Palette, Paintbrush, LayoutTemplate, Smartphone, 
  Star, Tag, BadgeCheck, RefreshCw, Boxes, UserCog, CreditCard,
  GraduationCap, ShieldCheck, Handshake, ChevronRight, Globe, Key, LifeBuoy, AlertTriangle
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { api } from '@/utils/api';
import NotificationBell from '@/components/NotificationBell';

const Badge = ({ children, type = 'NEW' }: { children: React.ReactNode, type?: 'NEW' | 'BETA' }) => (
  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto ${
    type === 'BETA' ? 'bg-purple-100 text-purple-700' : 'bg-[#5022C3] text-white'
  }`}>
    {children}
  </span>
);

let audioCtx: AudioContext | null = null;
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        audioCtx.resume();
      }
    }
    window.removeEventListener('click', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
}

const playNotificationSound = () => {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.5);
  } catch(e) { console.error('Audio play error', e) }
};

const SidebarItem = ({ item, pathname }: { item: any, pathname: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (item.subItems) {
    const isActive = item.subItems.some((sub: any) => pathname === sub.path || pathname.startsWith(sub.path + '/'));
    
    useEffect(() => {
      if (isActive) setIsExpanded(true);
    }, [isActive]);

    return (
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center px-3 py-2 w-full rounded-lg text-sm transition-colors group ${
            isActive ? 'bg-purple-50 text-[#5022C3] font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#5022C3]' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>{item.name}</span>
          <ChevronRight className={`w-4 h-4 ml-auto text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
        {isExpanded && (
          <div className="flex flex-col gap-0.5 pl-11 pr-2 py-1">
            {item.subItems.map((sub: any) => {
              const subActive = pathname === sub.path;
              return (
                <Link
                  key={sub.name}
                  href={sub.path}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    subActive ? 'text-[#5022C3] font-medium bg-purple-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{sub.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isActive = pathname === item.path;
  return (
    <Link
      href={item.path}
      className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors group ${
        isActive 
          ? 'bg-purple-50 text-[#5022C3] font-medium' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#5022C3]' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span>{item.name}</span>
      {item.badge && <Badge type={item.badge}>{item.badge}</Badge>}
      {item.hasArrow && <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />}
    </Link>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [merchantUser, setMerchantUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('');
  const [fullSubscription, setFullSubscription] = useState<any>(null);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTicketsCount = async () => {
        try {
          const res = await api.get('/support/my-tickets');
          const openTickets = res.data.data.filter((t: any) => t.status === 'OPEN');
          setOpenTicketsCount(openTickets.length);
        } catch (err) {}
      };

      fetchTicketsCount();

      import('socket.io-client').then(({ io }) => {
        const socket = io(process.env.NEXT_PUBLIC_WS_URL || "");
        
        if (merchantUser?._id) {
          socket.emit('join_user_room', merchantUser._id);
        }

        const tenantId = merchantUser?.tenantId || merchantUser?._id;
        if (tenantId) {
          socket.emit('join_tenant_room', tenantId);
        }

        socket.on('refresh_tickets', fetchTicketsCount);

        socket.on('new_order', (order: any) => {
          playNotificationSound();
          toast.success(`New order received from ${order.customerName || 'a customer'}!`, { duration: 4000 });
          window.dispatchEvent(new Event('dashboard:refresh'));
        });

        return () => {
          if (merchantUser?._id) {
            socket.emit('leave_user_room', merchantUser._id);
          }
          if (tenantId) {
            socket.emit('leave_tenant_room', tenantId);
          }
          socket.off('refresh_tickets');
          socket.off('new_order');
          socket.close();
        };
      });
    }
  }, [isAuthenticated, merchantUser?._id]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('merchantUser');
    if (!storedUser) {
      router.push('/login');
    } else {
      try {
        setMerchantUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSubscription = async () => {
        try {
          const res = await api.get('/subscriptions/my-subscription');
          const sub = res.data?.data;
          if (sub) {
            setFullSubscription(sub);
            setSubscriptionExpired(false);
            if (sub.packageId?.name) {
              setCurrentPlan(sub.packageId.name);
            } else if (sub.isTrial) {
              setCurrentPlan('Free Trial');
            }
          } else {
            setSubscriptionExpired(true);
            try {
              const lastRes = await api.get('/subscriptions/my-subscription?includeExpired=true');
              const lastSub = lastRes.data?.data;
              if (lastSub) {
                setFullSubscription({ ...lastSub, status: 'expired' });
                setCurrentPlan(lastSub.isTrial ? 'Free Trial (Expired)' : `${lastSub.packageId?.name || 'Plan'} (Expired)`);
              } else {
                setCurrentPlan('No Active Plan');
              }
            } catch {
              setCurrentPlan('No Active Plan');
            }
          }
        } catch (error) {
          console.error('Error fetching subscription in layout', error);
        }
      };
      fetchSubscription();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin"></div>
      </div>
    );
  }

  const navGroups = [
    {
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
        { name: 'Products', path: '/dashboard/products', icon: Package },
        { name: 'Categories', path: '/dashboard/categories', icon: ListTree },
        { name: 'Customers', path: '/dashboard/customers', icon: Users },
        { name: 'Courier', path: '/dashboard/courier-automation', icon: Truck, badge: 'NEW' },
        { name: 'Fraud Check', path: '/dashboard/fraud-check', icon: ShieldCheck, badge: 'NEW' },
        { name: 'Checkout Leads', path: '/dashboard/checkout-leads', icon: Users, badge: 'NEW' },
      ]
    },
    {
      title: 'Shop & Growth',
      items: [
        { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
        { name: 'Themes', path: '/dashboard/themes', icon: Palette },
      ]
    },
    {
      title: 'Settings',
      items: [
        { name: 'Profile', path: '/dashboard/profile', icon: UserCog },
        { name: 'Domain', path: '/dashboard/domain', icon: Globe },
        { name: 'API Keys', path: '/dashboard/api-keys', icon: Key },
        { name: 'Support', path: '/dashboard/support', icon: LifeBuoy, badge: openTicketsCount > 0 ? String(openTicketsCount) : undefined, badgeType: 'OPEN' },
        { 
          name: 'Subscription', 
          icon: CreditCard,
          subItems: [
            { name: 'My Plan', path: '/dashboard/subscription' },
            { name: 'Add-ons', path: '/dashboard/subscription/addons' }
          ]
        },
      ]
    }
  ];

  let banner = null;
  if (subscriptionExpired) {
    const isTrial = fullSubscription?.isTrial;
    banner = (
      <div className="bg-red-50 text-red-600 px-4 py-2 flex items-center justify-center gap-2 border-b border-red-100 text-sm font-medium z-50">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{isTrial ? '⏱️ Your free trial has ended.' : '🔴 Your subscription has expired.'} Your store is currently <strong>offline</strong>.</span>
        <Link href="/dashboard/subscription" className="underline font-bold ml-2 hover:text-red-700 whitespace-nowrap">
          {isTrial ? 'Upgrade Now' : 'Subscribe Now'}
        </Link>
      </div>
    );
  } else if (fullSubscription) {
    const end = new Date(fullSubscription.endDate);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    if (fullSubscription.status === 'expired' || fullSubscription.status === 'cancelled' || daysLeft <= 0) {
      banner = (
        <div className="bg-red-50 text-red-600 px-4 py-2 flex items-center justify-center gap-2 border-b border-red-100 text-sm font-medium z-50">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{fullSubscription.isTrial ? '⏱️ Your free trial has ended.' : '🔴 Your subscription has expired.'} Your store is currently <strong>offline</strong>.</span>
          <Link href="/dashboard/subscription" className="underline font-bold ml-2 hover:text-red-700 whitespace-nowrap">{fullSubscription.isTrial ? 'Upgrade Now' : 'Subscribe Now'}</Link>
        </div>
      );
    } else if (daysLeft <= 5 && fullSubscription.isTrial) {
      banner = (
        <div className="bg-amber-50 text-amber-700 px-4 py-2 flex items-center justify-center gap-2 border-b border-amber-100 text-sm font-medium z-50">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>⏱️ Your free trial expires in <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong>. Upgrade now to keep your store live after the trial.</span>
          <Link href="/dashboard/subscription" className="underline font-bold ml-2 hover:text-amber-800 whitespace-nowrap">View Plans</Link>
        </div>
      );
    } else if (daysLeft <= 5 && !fullSubscription.isTrial) {
      banner = (
        <div className="bg-orange-50 text-orange-700 px-4 py-2 flex items-center justify-center gap-2 border-b border-orange-100 text-sm font-medium z-50">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>⚠️ Your subscription expires in <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong>. Renew now to avoid any downtime.</span>
          <Link href="/dashboard/subscription" className="underline font-bold ml-2 hover:text-orange-800 whitespace-nowrap">Renew Now</Link>
        </div>
      );
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden">
              <img src="/MEasy.png" alt="MashEasy" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
                {process.env.NEXT_PUBLIC_PLATFORM_NAME || 'Platform'}
              </h1>
              <span className="text-xs font-medium text-gray-500">Merchant Hub</span>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
              {group.title && (
                <div className="flex items-center px-3 mb-2">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </h3>
                  {(group as any).titleBadge && <Badge>{(group as any).titleBadge}</Badge>}
                </div>
              )}
              <nav className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <SidebarItem key={item.name} item={item} pathname={pathname} />
                ))}
              </nav>
            </div>
          ))}
        </div>
        
        {/* Subscription Status Card */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {subscriptionExpired ? (
            <div className="border border-red-200 rounded-xl p-3 bg-red-50 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span className="font-semibold text-sm text-red-700 truncate">{currentPlan}</span>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full ml-auto flex-shrink-0"></div>
              </div>
              <p className="text-xs text-red-600 mb-3">Your store is currently offline.</p>
              <Link href="/dashboard/subscription" className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
                Subscribe Now
              </Link>
            </div>
          ) : (
            <div className="border border-purple-100 rounded-xl p-3 bg-white shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 text-[#5022C3] flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-sm text-gray-900 truncate">{currentPlan || '...'}</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-auto flex-shrink-0"></div>
              </div>
              {(currentPlan.toLowerCase().includes('trial') || currentPlan.toLowerCase().includes('free')) && (
                <>
                  <p className="text-xs text-gray-500 mb-3">Upgrade to unlock all features.</p>
                  <Link href="/dashboard/subscription" className="w-full bg-[#5022C3] hover:bg-purple-700 text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
                    Upgrade Plan
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {banner}
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex flex-col justify-center">
             <h2 className="text-lg font-bold text-gray-900">
               {pathname === '/dashboard/orders' ? 'Orders Management' : 
                pathname === '/dashboard/products' ? 'Products Management' : 
                pathname === '/dashboard/categories' ? 'Categories Management' : 
                pathname === '/dashboard/customers' ? 'Customers Management' : 
                'Dashboard'}
             </h2>
             {pathname !== '/dashboard' && (
               <p className="text-xs text-gray-500">
                 {pathname === '/dashboard/orders' ? 'View and process customer orders' : 
                  pathname === '/dashboard/products' ? "Manage your store's inventory" : 
                  pathname === '/dashboard/categories' ? 'Organize your products into categories' : 
                  pathname === '/dashboard/customers' ? 'Manage your customer relationships' : 
                  pathname === '/dashboard/courier-automation' ? 'Automate courier integration and shipments' : 
                  pathname === '/dashboard/fraud-check' ? 'Monitor orders for fraud detection' : 
                  ''}
               </p>
             )}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell userId={merchantUser?._id} />
            {merchantUser && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-right hidden sm:block">
                  <div className="font-medium text-gray-900">{merchantUser.name || 'Merchant'}</div>
                  <div className="text-xs text-gray-500">{merchantUser.email}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-purple-100 text-[#5022C3] flex items-center justify-center font-bold overflow-hidden border border-purple-200">
                  {merchantUser.avatar?.secure_url ? (
                    <img src={merchantUser.avatar.secure_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (merchantUser.name || merchantUser.email || 'M').charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            )}
            <button 
              onClick={() => {
                sessionStorage.removeItem('merchantUser');
                router.push('/login');
              }}
              className="ml-4 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
      
      <Toaster position="top-right" />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
