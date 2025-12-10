import { NextResponse } from "next/server";
import ProductRepository from "@/layers/repositories/ProductRepository";

export default class ProductController {
  private repo: ProductRepository;

  constructor() {
    this.repo = new ProductRepository();
  }

  async getAll(sellerId?: string) {
    try {
      const data = sellerId ? await this.repo.getBySellerId(sellerId) : [];
      return NextResponse.json({ success: true, data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  async getById(id: string) {
    try {
      const data = await this.repo.findById(id);
      return NextResponse.json({ success: true, data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  async create(payload: any) {
    try {
      // Validate required fields
      if (!payload.seller_id) {
        return NextResponse.json(
          { success: false, message: "seller_id is required" },
          { status: 400 }
        );
      }
      if (!payload.name || !payload.category_id) {
        return NextResponse.json(
          { success: false, message: "name and category_id are required" },
          { status: 400 }
        );
      }

      const data = await this.repo.create(payload);
      return NextResponse.json({ success: true, data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  async update(id: string, payload: unknown) {
    try {
      const data = await this.repo.update(id, payload);
      return NextResponse.json({ success: true, data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  async delete(id: string) {
    try {
      await this.repo.delete(id);
      return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  async getCategories() {
    try {
      const data = await this.repo.getCategories();
      return NextResponse.json({ success: true, data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  async getStats(sellerId: string) {
    try {
      const data = await this.repo.getProductStats(sellerId);
      return NextResponse.json({ success: true, data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }
}