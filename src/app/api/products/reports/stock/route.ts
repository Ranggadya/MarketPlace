import ReportController from "@/layers/controllers/ReportController";
import { NextRequest } from "next/server";

const controller = new ReportController();
const DEV_USER_ID = "77c3dac9-5717-4998-acd2-3aaf8686d4f5"; // ID KAMU

export async function GET(req: NextRequest) {
  return controller.getStockData(DEV_USER_ID);
}