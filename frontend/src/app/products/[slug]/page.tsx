import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, type Product } from "@/lib/api";
import { demoProducts } from "@/lib/demo";
import ProductDetailView from "@/components/ProductDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let product: Product | null =
    demoProducts.find((p) => p.slug === params.slug) ?? null;

  try {
    product = (await api.getProductBySlug(params.slug)) ?? product;
  } catch {
    // Fall back to demo
  }

  if (!product) return { title: "Product Not Found | AvenderLine" };

  const displayName = product.name;
  const description = product.description || product.description || "Luxury Qatari haute couture abaya handcrafted at our Doha atelier.";

  return {
    title: `${displayName} | AvenderLine Haute Couture`,
    description,
    openGraph: {
      title: displayName,
      description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: Product | null =
    demoProducts.find((p) => p.slug === params.slug) ?? null;

  try {
    product = (await api.getProductBySlug(params.slug)) ?? product;
  } catch {
    // Fall back to demo data
  }

  if (!product) notFound();

  const relatedProducts = demoProducts
    .filter((p) => p.id !== product!.id)
    .slice(0, 4);

  return (
    <main>
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
