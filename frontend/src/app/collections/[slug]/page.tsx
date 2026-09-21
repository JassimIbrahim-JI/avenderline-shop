import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, type Category, type Product } from "@/lib/api";
import { demoCategories, demoProducts } from "@/lib/demo";
import CollectionFilterView from "@/components/CollectionFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = demoCategories.find((c) => c.slug === params.slug);
  const title = category
    ? `${category.name} | AvenderLine Maison`
    : "Haute Couture Collections | AvenderLine";

  return {
    title,
    description: category?.description || category?.description || "Exclusive curated collection of handcrafted Qatari luxury abayas and royal bishts.",
  };
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  let category: Category | null =
    demoCategories.find((c) => c.slug === slug) ?? null;
  let products: Product[] = demoProducts.filter(
    (p) => p.categoryId === category?.id || slug === "all"
  );

  try {
    const categories = await api.getCategories();
    const found = categories.find((c) => c.slug === slug) ?? null;
    if (found) {
      category = found;
      const data = await api.getProducts({ categoryId: found.id, pageSize: 50 });
      products = data.items.length ? data.items : products;
    }
  } catch {
    // Fall back to demo
  }

  // If slug is "all", show all products
  if (slug === "all") {
    products = demoProducts;
    category = {
      id: "all",
      name: "All Abayas & Bishts",
      slug: "all",
      description: "Explore the complete AvenderLine catalog.",
    };
  }

  if (!category && products.length === 0) {
    notFound();
  }

  return (
    <main>
      <CollectionFilterView
        category={category}
        slug={slug}
        initialProducts={products.length ? products : demoProducts}
      />
    </main>
  );
}
