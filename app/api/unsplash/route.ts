import { NextRequest, NextResponse } from "next/server";
import { getUnsplashImage, isUnsplashSection } from "@/lib/unsplash";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section") ?? "";

  if (!isUnsplashSection(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const url = await getUnsplashImage(section);

  return NextResponse.json(
    { url },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
