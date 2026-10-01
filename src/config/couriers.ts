export interface CourierProvider {
  id: string;
  name: string;
  icon: string;
  trackingUrl?: (consignmentId: string) => string;
}

export const COURIER_PROVIDERS: CourierProvider[] = [
  {
    id: "pathao",
    name: "Pathao",
    icon: "/Courier_images/pathao_courier.png",
    trackingUrl: (cid: string) => `https://merchant.pathao.com/tracking?consignment_id=${cid}`,
  },
  {
    id: "steadfast",
    name: "Steadfast",
    icon: "/Courier_images/steadfast_courier.jpg",
    trackingUrl: (cid: string) => `https://steadfast.com.bd/t/${cid}`,
  },
  {
    id: "redx",
    name: "REDX",
    icon: "/Courier_images/redx-logo.png",
    trackingUrl: (cid: string) => `https://redx.com.bd/track/${cid}`,
  },
];

export const COURIER_MAP: Record<string, CourierProvider> = COURIER_PROVIDERS.reduce(
  (acc, provider) => {
    acc[provider.id.toLowerCase()] = provider;
    return acc;
  },
  {} as Record<string, CourierProvider>
);

export const getCourierProvider = (id?: string): CourierProvider | undefined => {
  if (!id) return undefined;
  return COURIER_MAP[id.toLowerCase()];
};

export const getCourierIcon = (id?: string): string => {
  const provider = getCourierProvider(id);
  return provider?.icon || "/Courier_images/pathao_courier.png";
};

export const getCourierTrackingUrl = (providerId?: string, consignmentId?: string): string => {
  if (!consignmentId) return "";
  const provider = getCourierProvider(providerId);
  if (provider?.trackingUrl) {
    return provider.trackingUrl(consignmentId);
  }
  return `https://www.google.com/search?q=${providerId || "courier"}+tracking+${consignmentId}&igu=1`;
};
