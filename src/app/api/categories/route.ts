import ProductController from "@/layers/controllers/ProductController";

const controller = new ProductController();

export async function GET() {
  return controller.getCategories();
}