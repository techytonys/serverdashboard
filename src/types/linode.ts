// Linode API Types
export interface LinodeInstance {
  id: number;
  label: string;
  status:
    | "provisioning"
    | "booting"
    | "running"
    | "shutting_down"
    | "offline"
    | "rebuilding";
  region: string;
  type: string;
  image: string;
  ipv4: string[];
  ipv6: string;
  created: string;
  updated: string;
  specs?: {
    disk: number;
    memory: number;
    vcpus: number;
    transfer: number;
  };
}

export interface LinodeType {
  id: string;
  label: string;
  price: {
    hourly: number;
    monthly: number;
  };
  specs?: {
    disk: number;
    memory: number;
    vcpus: number;
    transfer: number;
  };
}

export interface LinodeRegion {
  id: string;
  label: string;
  country: string;
  capabilities: string[];
}

export interface LinodeImage {
  id: string;
  label: string;
  description: string;
  is_public: boolean;
  size: number;
  created: string;
}

export interface BillingInfo {
  balance: number;
  balance_uninvoiced: number;
  active_since: string;
  credit_card?: {
    last_four: string;
    expiry: string;
  };
}

export interface Invoice {
  id: number;
  date: string;
  label: string;
  subtotal: number;
  tax: number;
  total: number;
}

export interface CreateLinodeRequest {
  type: string;
  region: string;
  image: string;
  label: string;
  root_pass: string;
  authorized_keys?: string[];
  stackscript_id?: number;
  stackscript_data?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  page?: number;
  pages?: number;
  results?: number;
}

export interface ApiError {
  errors: Array<{
    field: string;
    reason: string;
  }>;
}
