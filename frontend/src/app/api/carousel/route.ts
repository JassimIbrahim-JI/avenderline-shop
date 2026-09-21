import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export interface CarouselSlide {
  id: number;
  imageUrl: string;
  tag: string;
  tagAr: string;
  title: string;
  titleAr: string;
  ctaText: string;
  ctaTextAr: string;
  ctaLink: string;
  objectPosition: string;
  active: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CAROUSEL_FILE = path.join(DATA_DIR, "carousel.json");

const defaultSlides: CarouselSlide[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1762605135376-ae5af70a5628?auto=format&fit=crop&w=2400&q=90",
    tag: "HAUTE COUTURE Â· SUMMER 2026",
    tagAr: "Ù‡ÙˆØª ÙƒÙˆØªÙˆØ± Â· ØµÙŠÙ 2026",
    title: "TIMELESS COUTURE ELEGANCE",
    titleAr: "Ø£Ù†Ø§Ù‚Ø© Ø§Ù„ÙƒÙˆØªÙˆØ± Ø§Ù„Ø®Ø§Ù„Ø¯Ø©",
    ctaText: "EXPLORE THE NEW COLLECTION",
    ctaTextAr: "Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„ØªØ´ÙƒÙŠÙ„Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
    ctaLink: "#featured",
    objectPosition: "center top",
    active: true,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=2400&q=90",
    tag: "HERITAGE ROYALTY Â· MAISON BISHT",
    tagAr: "Ø£ØµØ§Ù„Ø© Ù…Ù„ÙƒÙŠØ© Â· Ø¨Ø´Øª Ø§Ù„Ø¯Ø§Ø±",
    title: "GILDED WITH PURE GOLD KASAB",
    titleAr: "Ù…Ø·Ø±Ø²Ø© Ø¨Ù‚ØµØ¨ Ø§Ù„Ø°Ù‡Ø¨ Ø§Ù„Ø®Ø§Ù„Øµ",
    ctaText: "SHOP THE BISHT EDIT",
    ctaTextAr: "ØªØ³ÙˆÙ‚ÙŠ ØªØ´ÙƒÙŠÙ„Ø© Ø§Ù„Ø¨Ø´ÙˆØª",
    ctaLink: "/collections/classics",
    objectPosition: "center top",
    active: true,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1762605135326-5c4bcc5ef006?auto=format&fit=crop&w=2400&q=90",
    tag: "JAPANESE SILK Â· BESPOKE DRAPES",
    tagAr: "Ø­Ø±ÙŠØ± ÙŠØ§Ø¨Ø§Ù†ÙŠ Â· ØªÙØµÙŠÙ„ Ø®Ø§Øµ",
    title: "FLUID SILHOUETTES CRAFTED IN DOHA",
    titleAr: "Ù‚ØµØ§Øª Ø§Ù†Ø³ÙŠØ§Ø¨ÙŠØ© Ø­ÙŠÙƒØª ÙÙŠ Ø§Ù„Ø¯ÙˆØ­Ø©",
    ctaText: "DISCOVER THE ATELIER",
    ctaTextAr: "Ø§ÙƒØªØ´ÙÙŠ Ø¥Ø¨Ø¯Ø§Ø¹Ø§Øª Ø§Ù„Ù…Ø´ØºÙ„",
    ctaLink: "/collections/women",
    objectPosition: "center top",
    active: true,
  },
];

async function getSlides(): Promise<CarouselSlide[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(CAROUSEL_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    await fs.writeFile(CAROUSEL_FILE, JSON.stringify(defaultSlides, null, 2), "utf-8");
    return defaultSlides;
  }
}

async function saveSlides(slides: CarouselSlide[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CAROUSEL_FILE, JSON.stringify(slides, null, 2), "utf-8");
}

// GET /api/carousel
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const slides = await getSlides();
    const result = showAll ? slides : slides.filter((s) => s.active !== false);

    return NextResponse.json({
      success: true,
      count: result.length,
      slides: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/carousel (Update all slides from Admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slides } = body;

    if (!Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { error: "A valid array of slides is required." },
        { status: 400 }
      );
    }

    // Validate each slide has minimum required fields
    for (const slide of slides) {
      if (!slide.imageUrl) {
        return NextResponse.json(
          { error: "Each slide must have an image URL." },
          { status: 400 }
        );
      }
    }

    await saveSlides(slides);

    return NextResponse.json({
      success: true,
      message: "Hero carousel slides updated successfully.",
      slides,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


