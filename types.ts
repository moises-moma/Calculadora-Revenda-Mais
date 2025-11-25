
export interface BasePlan {
  id: string;
  name: string;
  vehicles: number;
  users: number;
  storage: string;
  monthlyPrice: number;
  annualPrice: number; // The discounted monthly price when paid annually
}

export interface AdditionalService {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice?: number; // If different when paid annually
  isOneTime?: boolean;
}

export interface WebsiteOption {
  id: string;
  name: string;
  price: number;
}

export interface CrmOption {
  id: string;
  name: string;
  price: number;
  setupFee: number;
}

export interface AdditionalProduct {
  id: string;
  name: string;
  price: number;
  unitLabel?: string;
}

export interface CartState {
  selectedPlanId: string;
  selectedServices: string[];
  selectedWebsiteId: string | null;
  isWebsiteBonused: boolean;
  selectedCrmId: string | null;
  productQuantities: Record<string, number>;
}
