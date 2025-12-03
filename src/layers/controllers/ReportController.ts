import ReportService from "../services/ReportService";
import { NextResponse } from "next/server";

export default class ReportController {
  private service: ReportService;

  constructor() {
    this.service = new ReportService();
  }

  async getStockData(sellerId: string) {
    try {
      const data = await this.service.getStockReport(sellerId);
      return NextResponse.json({ success: true, data });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async getRatingData(sellerId: string) {
    try {
      const data = await this.service.getRatingReport(sellerId);
      return NextResponse.json({ success: true, data });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async getWarningData(sellerId: string) {
    try {
      const data = await this.service.getWarningReport(sellerId);
      return NextResponse.json({ success: true, data });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
}