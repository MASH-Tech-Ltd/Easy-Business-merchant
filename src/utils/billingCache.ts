// Memory cache store for merchant subscription & payment data
// Provides instant tab switching & background revalidation (RTK Query style)

export interface BillingCacheStore {
  addons: any[] | null;
  purchasedAddons: any[] | null;
  hasActiveSubscription: boolean | null;
  subscriptionEndDate: string | null;
  platformAccounts: any[] | null;
  myPayments: any[] | null;
  lastFetched: number;
}

export const billingCacheStore: BillingCacheStore = {
  addons: null,
  purchasedAddons: null,
  hasActiveSubscription: null,
  subscriptionEndDate: null,
  platformAccounts: null,
  myPayments: null,
  lastFetched: 0,
};

export const clearBillingCache = () => {
  billingCacheStore.addons = null;
  billingCacheStore.purchasedAddons = null;
  billingCacheStore.hasActiveSubscription = null;
  billingCacheStore.subscriptionEndDate = null;
  billingCacheStore.platformAccounts = null;
  billingCacheStore.myPayments = null;
  billingCacheStore.lastFetched = 0;
};
