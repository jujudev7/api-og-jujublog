import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // Enable dynamic rendering

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const interBold = await fetch(
      `${baseUrl}/assets/fonts/Inter-Bold.ttf`
    ).then((res) => res.arrayBuffer());

    const title = req.nextUrl.searchParams.get("title");

    if (!title) {
      const defaultImageResponse = await fetch(
        `${baseUrl}/opengraph-image.jpg`
      );

      if (defaultImageResponse.ok) {
        return new Response(await defaultImageResponse.arrayBuffer(), {
          headers: {
            "Content-Type": "image/jpeg",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      return new Response("Default image could not be loaded", { status: 500 });
    }

    const heading =
      title.length > 140 ? `${title.substring(0, 140)}...` : title;

    const imageResponse = new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start text-black"
          style={{
            backgroundImage: `url(${baseUrl}/bg-og.jpg)`,
          }}
        >
          <div tw="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
            <p tw="ml-2 font-bold text-2xl">JujuBlog</p>
          </div>
          <div tw="flex flex-col flex-1 py-10 px-20 text-white">
            <div tw="flex text-xl uppercase font-bold tracking-tight font-normal">
              Article
            </div>
            <div tw="flex text-[80px] font-bold text-[50px]">{heading}</div>
          </div>
          <div tw="flex items-center w-full justify-between">
            <div tw="flex text-xl">{siteConfig.url}</div>
            <div tw="flex items-center text-xl">
              <div tw="flex ml-2">{siteConfig.links.github}</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 533,
        fonts: [
          {
            name: "Inter",
            data: interBold,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );

    return new Response(imageResponse.body, {
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
