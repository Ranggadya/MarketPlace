import { createClient } from "@/lib/supabase";

export interface OrderSummary {
  total: number;
  today: number;
}

export class OrderService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async getSummaryBySeller(sellerId: string): Promise<OrderSummary> {
    const { data, error } = await this.supabase
      .from("orders")             
      .select("created_at")
      .eq("seller_id", sellerId);

    if (error) {
      console.error("Failed to fetch orders summary", error);
      throw error;
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    const summary: OrderSummary = {
      total: data.length,
      today: data.filter((o) =>
        String(o.created_at).slice(0, 10) === todayStr
      ).length,
    };

    return summary;
  }
}
