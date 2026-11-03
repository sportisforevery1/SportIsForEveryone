import { NextResponse } from "next/server";

import { getCms } from "@/lib/cms";

/** Lightweight check: Blob token present + whether recent media URLs are on Blob. No secrets returned. */
export async function GET() {
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null; // siteUrl canonical check

  try {
    const payload = await getCms();
    const result = await payload.find({
      collection: "media",
      limit: 8,
      depth: 0,
      sort: "-updatedAt",
      overrideAccess: true,
    });

    const recent = result.docs.map((doc) => {
      const url = typeof doc.url === "string" ? doc.url : "";
      return {
        id: doc.id,
        filename: doc.filename,
        onBlob: url.includes("blob.vercel-storage.com"),
        localFileRoute: url.includes("/api/media/file/"),
      };
    });

    return NextResponse.json({
      ok: blobConfigured && recent.every((row) => !row.localFileRoute || row.onBlob),
      blobConfigured,
      siteUrl,
      recent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        blobConfigured,
        siteUrl,
        error: error instanceof Error ? error.message : "media health failed",
      },
      { status: 500 },
    );
  }
}
