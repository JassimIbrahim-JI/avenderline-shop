import { api, type Category, type Product } from "@/lib/api";
import { demoCategories, demoProducts } from "@/lib/demo";
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = demoProducts;
  let categories: Category[] = demoCategories;

  try {
    const [productData, categoryData] = await Promise.all([
      api.getProducts({ isFeatured: true, pageSize: 8 }),
      api.getCategories(),
    ]);
    products = productData.items.length ? productData.items : products;
    categories = categoryData.length ? categoryData : categories;
  } catch {
    // Fall back to curated demo data when the backend is offline
  }

  return <HomeContent products={products} categories={categories} />;
}

