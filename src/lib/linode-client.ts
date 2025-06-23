import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  LinodeInstance,
  LinodeType,
  LinodeRegion,
  LinodeImage,
  BillingInfo,
  Invoice,
  CreateLinodeRequest,
  ApiResponse,
  ApiError,
} from "@/types/linode";

class LinodeApiClient {
  private client: AxiosInstance;

  constructor(token?: string) {
    if (!token && typeof window === "undefined") {
      // Server-side: use environment variable
      token = process.env.LINODE_API_TOKEN;
    }

    if (!token) {
      throw new Error("Linode API token is required");
    }

    this.client = axios.create({
      baseURL: "https://api.linode.com/v4",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });
  }

  // Server Management Methods
  async getLinodes(): Promise<LinodeInstance[]> {
    try {
      const response: AxiosResponse<ApiResponse<LinodeInstance[]>> =
        await this.client.get("/linode/instances");
      this.validateResponse(response);

      // Ensure we have a valid data structure
      const instances = response.data.data || [];

      // Add safety checks for each instance
      return instances.map((instance) => ({
        ...instance,
        ipv4: instance.ipv4 || [],
        specs: instance.specs || undefined,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLinode(id: number): Promise<LinodeInstance> {
    try {
      const response: AxiosResponse<LinodeInstance> = await this.client.get(
        `/linode/instances/${id}`
      );
      this.validateResponse(response);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createLinode(config: CreateLinodeRequest): Promise<LinodeInstance> {
    try {
      const response: AxiosResponse<LinodeInstance> = await this.client.post(
        "/linode/instances",
        config
      );
      this.validateResponse(response);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteLinode(id: number): Promise<void> {
    try {
      const response = await this.client.delete(`/linode/instances/${id}`);
      this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async rebootLinode(id: number): Promise<void> {
    try {
      const response = await this.client.post(`/linode/instances/${id}/reboot`);
      this.validateResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateLinode(
    id: number,
    updates: { label?: string }
  ): Promise<LinodeInstance> {
    try {
      console.log("LinodeApiClient: updateLinode called with:", {
        id,
        updates,
      });

      // Use the correct Linode API format
      const response: AxiosResponse<LinodeInstance> = await this.client.put(
        `/linode/instances/${id}`,
        updates // Linode expects the updates directly, not wrapped
      );

      console.log("LinodeApiClient: Response status:", response.status);

      this.validateResponse(response);
      console.log("LinodeApiClient: Update successful");
      return response.data;
    } catch (error) {
      console.error("LinodeApiClient: updateLinode error:", error);

      // Enhanced error logging for Linode API issues
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        console.error("LinodeApiClient: Linode API Error Details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          sentData: axiosError.config?.data,
        });

        // Log specific Linode error format
        if (axiosError.response?.data?.errors) {
          console.error(
            "LinodeApiClient: Linode API Errors:",
            axiosError.response.data.errors
          );
        }
      }

      throw this.handleError(error);
    }
  }

  // Resource Methods
  async getLinodeTypes(): Promise<LinodeType[]> {
    try {
      const response: AxiosResponse<ApiResponse<LinodeType[]>> =
        await this.client.get("/linode/types");
      this.validateResponse(response);

      // Ensure we have valid data structure
      const types = response.data.data || [];

      // Add safety checks for each type
      return types.map((type) => ({
        ...type,
        specs: type.specs || undefined,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRegions(): Promise<LinodeRegion[]> {
    try {
      const response: AxiosResponse<ApiResponse<LinodeRegion[]>> =
        await this.client.get("/regions");
      this.validateResponse(response);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getImages(): Promise<LinodeImage[]> {
    try {
      const response: AxiosResponse<ApiResponse<LinodeImage[]>> =
        await this.client.get("/images");
      this.validateResponse(response);
      return response.data.data.filter((image: LinodeImage) => image.is_public);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Billing Methods
  async getAccountInfo(): Promise<BillingInfo> {
    try {
      const response: AxiosResponse<any> = await this.client.get("/account");
      this.validateResponse(response);
      return {
        balance: response.data.balance,
        balance_uninvoiced: response.data.balance_uninvoiced,
        active_since: response.data.active_since,
        credit_card: response.data.credit_card
          ? {
              last_four: response.data.credit_card.last_four,
              expiry: response.data.credit_card.expiry,
            }
          : undefined,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      const response: AxiosResponse<ApiResponse<Invoice[]>> =
        await this.client.get("/account/invoices");
      this.validateResponse(response);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility Methods
  private validateResponse(response: AxiosResponse): void {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  private handleError(error: any): Error {
    if (error.response?.data?.errors) {
      const apiError = error.response.data as ApiError;
      const errorMessages = apiError.errors
        .map((e) => `${e.field}: ${e.reason}`)
        .join(", ");
      return new Error(`Linode API Error: ${errorMessages}`);
    }

    if (error.response?.status === 401) {
      return new Error("Invalid or expired Linode API token");
    }

    if (error.response?.status === 429) {
      return new Error("Rate limit exceeded. Please try again later.");
    }

    return new Error(error.message || "Unknown Linode API error occurred");
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get("/account");
      this.validateResponse(response);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default LinodeApiClient;
