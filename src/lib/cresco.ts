import { products as fallbackProducts, categories as fallbackCategories, services as fallbackServices } from "./catalog";
import type { Product, CategorySlug, Service } from "./catalog";

export interface CrescoProduct extends Product {
  id?: string;
  inStock?: boolean;
  createdAt?: string;
}

export interface CrescoCategory {
  id?: string;
  slug: CategorySlug;
  name: string;
  blurb: string;
  icon: string;
  color: string;
  bgClass: string;
  image: string;
  createdAt?: string;
}

export interface CrescoService extends Service {
  id?: string;
  createdAt?: string;
}

export interface CrescoOrderItem {
  slug: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
  withInstall: boolean;
  installFee: number;
}

export interface CrescoOrder {
  id?: string;
  ref: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  state: string;
  items: CrescoOrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  installTotal?: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
  status: "Pending" | "Confirmed" | "Out for Delivery" | "Delivered" | "Installed" | "Cancelled";
  installDate?: string;
  installSlot?: string;
  notes?: string;
  createdAt?: string;
}

export interface CrescoBooking {
  id?: string;
  ref: string;
  serviceSlug: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  date: string;
  slot: string;
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  notes?: string;
  createdAt?: string;
}

export interface CrescoContactMessage {
  id?: string;
  name: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

export interface CrescoReview {
  id?: string;
  productSlug: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface CrescoUser {
  id: string;
  email: string;
  role: "guest" | "user" | "mod" | "admin";
  name?: string;
}

// Global local storage key for auth token
const AUTH_TOKEN_KEY = "lumora_cresco_jwt";

export class CrescoClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl.replace(/\/+$/, "");
    } else if (typeof window !== "undefined" && (window as unknown as { __CRESCO_URL__?: string }).__CRESCO_URL__) {
      this.baseUrl = (window as unknown as { __CRESCO_URL__: string }).__CRESCO_URL__;
    } else {
      this.baseUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_CRESCO_API_URL) || "http://localhost:3000";
    }
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...(options.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `CrescoDB error ${res.status}: ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson.message || errorJson.error) {
          errorMsg = errorJson.message || errorJson.error;
        }
      } catch {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return (await res.json()) as T;
  }

  // ── AUTHENTICATION ──────────────────────────────────────────────────────────
  auth = {
    register: async (email: string, pass: string, name?: string): Promise<{ token: string; user: CrescoUser }> => {
      const data = await this.request<{ token: string; user: CrescoUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password: pass, name }),
      });
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      return data;
    },

    login: async (email: string, pass: string): Promise<{ token: string; user: CrescoUser }> => {
      const data = await this.request<{ token: string; user: CrescoUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pass }),
      });
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      return data;
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    },

    me: async (): Promise<CrescoUser | null> => {
      try {
        return await this.request<CrescoUser>("/auth/me");
      } catch {
        return null;
      }
    },

    getToken: (): string | null => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(AUTH_TOKEN_KEY);
    },
  };

  // ── PRODUCTS API ────────────────────────────────────────────────────────────
  products = {
    list: async (category?: string): Promise<CrescoProduct[]> => {
      try {
        const query = category ? `?where=category:eq:${encodeURIComponent(category)}` : "";
        const data = await this.request<CrescoProduct[]>(`/products${query}`);
        if (Array.isArray(data) && data.length > 0) return data;
        return category
          ? fallbackProducts.filter((p) => p.category === category)
          : (fallbackProducts as CrescoProduct[]);
      } catch {
        return category
          ? fallbackProducts.filter((p) => p.category === category)
          : (fallbackProducts as CrescoProduct[]);
      }
    },

    getBySlug: async (slug: string): Promise<CrescoProduct | null> => {
      try {
        const data = await this.request<CrescoProduct[]>(`/products?where=slug:eq:${encodeURIComponent(slug)}&limit=1`);
        if (Array.isArray(data) && data.length > 0) return data[0]!;
        const fallback = fallbackProducts.find((p) => p.slug === slug);
        return fallback ? (fallback as CrescoProduct) : null;
      } catch {
        const fallback = fallbackProducts.find((p) => p.slug === slug);
        return fallback ? (fallback as CrescoProduct) : null;
      }
    },

    create: async (product: Omit<CrescoProduct, "id">): Promise<CrescoProduct> => {
      return await this.request<CrescoProduct>("/products", {
        method: "POST",
        body: JSON.stringify(product),
      });
    },

    update: async (idOrSlug: string, updates: Partial<CrescoProduct>): Promise<CrescoProduct> => {
      return await this.request<CrescoProduct>(`/products/${encodeURIComponent(idOrSlug)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    },

    delete: async (idOrSlug: string): Promise<{ success: boolean }> => {
      return await this.request<{ success: boolean }>(`/products/${encodeURIComponent(idOrSlug)}`, {
        method: "DELETE",
      });
    },
  };

  // ── CATEGORIES API ──────────────────────────────────────────────────────────
  categories = {
    list: async (): Promise<CrescoCategory[]> => {
      try {
        const data = await this.request<CrescoCategory[]>("/categories");
        if (Array.isArray(data) && data.length > 0) return data;
        return fallbackCategories as CrescoCategory[];
      } catch {
        return fallbackCategories as CrescoCategory[];
      }
    },

    create: async (category: Omit<CrescoCategory, "id">): Promise<CrescoCategory> => {
      return await this.request<CrescoCategory>("/categories", {
        method: "POST",
        body: JSON.stringify(category),
      });
    },

    update: async (idOrSlug: string, updates: Partial<CrescoCategory>): Promise<CrescoCategory> => {
      return await this.request<CrescoCategory>(`/categories/${encodeURIComponent(idOrSlug)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    },

    delete: async (idOrSlug: string): Promise<{ success: boolean }> => {
      return await this.request<{ success: boolean }>(`/categories/${encodeURIComponent(idOrSlug)}`, {
        method: "DELETE",
      });
    },
  };

  // ── SERVICES API ────────────────────────────────────────────────────────────
  services = {
    list: async (): Promise<CrescoService[]> => {
      try {
        const data = await this.request<CrescoService[]>("/services");
        if (Array.isArray(data) && data.length > 0) return data;
        return fallbackServices as CrescoService[];
      } catch {
        return fallbackServices as CrescoService[];
      }
    },

    getBySlug: async (slug: string): Promise<CrescoService | null> => {
      try {
        const data = await this.request<CrescoService[]>(`/services?where=slug:eq:${encodeURIComponent(slug)}&limit=1`);
        if (Array.isArray(data) && data.length > 0) return data[0]!;
        const fallback = fallbackServices.find((s) => s.slug === slug);
        return fallback ? (fallback as CrescoService) : null;
      } catch {
        const fallback = fallbackServices.find((s) => s.slug === slug);
        return fallback ? (fallback as CrescoService) : null;
      }
    },

    create: async (service: Omit<CrescoService, "id">): Promise<CrescoService> => {
      return await this.request<CrescoService>("/services", {
        method: "POST",
        body: JSON.stringify(service),
      });
    },

    update: async (idOrSlug: string, updates: Partial<CrescoService>): Promise<CrescoService> => {
      return await this.request<CrescoService>(`/services/${encodeURIComponent(idOrSlug)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    },

    delete: async (idOrSlug: string): Promise<{ success: boolean }> => {
      return await this.request<{ success: boolean }>(`/services/${encodeURIComponent(idOrSlug)}`, {
        method: "DELETE",
      });
    },
  };

  // ── ORDERS API ──────────────────────────────────────────────────────────────
  orders = {
    list: async (): Promise<CrescoOrder[]> => {
      try {
        return await this.request<CrescoOrder[]>("/orders?sort=createdAt:desc");
      } catch {
        return [];
      }
    },

    getByRef: async (ref: string): Promise<CrescoOrder | null> => {
      try {
        const data = await this.request<CrescoOrder[]>(`/orders?where=ref:eq:${encodeURIComponent(ref)}&limit=1`);
        return Array.isArray(data) && data.length > 0 ? data[0]! : null;
      } catch {
        return null;
      }
    },

    create: async (order: Omit<CrescoOrder, "id">): Promise<CrescoOrder> => {
      return await this.request<CrescoOrder>("/orders", {
        method: "POST",
        body: JSON.stringify({
          ...order,
          createdAt: order.createdAt || new Date().toISOString(),
        }),
      });
    },

    updateStatus: async (ref: string, status: CrescoOrder["status"]): Promise<CrescoOrder> => {
      return await this.request<CrescoOrder>(`/orders/${encodeURIComponent(ref)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
  };

  // ── BOOKINGS API ────────────────────────────────────────────────────────────
  bookings = {
    list: async (): Promise<CrescoBooking[]> => {
      try {
        return await this.request<CrescoBooking[]>("/bookings?sort=createdAt:desc");
      } catch {
        return [];
      }
    },

    getByRef: async (ref: string): Promise<CrescoBooking | null> => {
      try {
        const data = await this.request<CrescoBooking[]>(`/bookings?where=ref:eq:${encodeURIComponent(ref)}&limit=1`);
        return Array.isArray(data) && data.length > 0 ? data[0]! : null;
      } catch {
        return null;
      }
    },

    create: async (booking: Omit<CrescoBooking, "id">): Promise<CrescoBooking> => {
      return await this.request<CrescoBooking>("/bookings", {
        method: "POST",
        body: JSON.stringify({
          ...booking,
          createdAt: booking.createdAt || new Date().toISOString(),
        }),
      });
    },

    updateStatus: async (ref: string, status: CrescoBooking["status"]): Promise<CrescoBooking> => {
      return await this.request<CrescoBooking>(`/bookings/${encodeURIComponent(ref)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
  };

  // ── CONTACT INQUIRIES API ───────────────────────────────────────────────────
  contact = {
    submit: async (message: Omit<CrescoContactMessage, "id">): Promise<CrescoContactMessage> => {
      return await this.request<CrescoContactMessage>("/contactmessages", {
        method: "POST",
        body: JSON.stringify({
          ...message,
          createdAt: message.createdAt || new Date().toISOString(),
        }),
      });
    },

    list: async (): Promise<CrescoContactMessage[]> => {
      try {
        return await this.request<CrescoContactMessage[]>("/contactmessages?sort=createdAt:desc");
      } catch {
        return [];
      }
    },
  };

  // ── REALTIME SSE SUBSCRIPTION ───────────────────────────────────────────────
  channel(model: string) {
    return {
      on: (event: string, callback: (eventData: unknown) => void) => {
        let eventSource: EventSource | null = null;
        return {
          subscribe: () => {
            if (typeof window === "undefined") return { unsubscribe: () => {} };
            try {
              const url = `${this.baseUrl}/realtime?model=${encodeURIComponent(model)}`;
              eventSource = new EventSource(url);
              eventSource.addEventListener(event, (e) => {
                try {
                  const parsed = JSON.parse(e.data);
                  callback(parsed);
                } catch {
                  callback(e.data);
                }
              });
            } catch (err) {
              console.warn("CrescoDB Realtime subscription fallback:", err);
            }
            return {
              unsubscribe: () => {
                if (eventSource) {
                  eventSource.close();
                }
              },
            };
          },
        };
      },
    };
  }
}

// Export singleton instance
export const cresco = new CrescoClient();
