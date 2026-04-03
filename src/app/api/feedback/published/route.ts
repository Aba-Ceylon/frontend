import { NextResponse } from "next/server";
import type { FeedbackRecord } from "@/types/feedback";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if (!url || !key) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const res = await fetch(
      `${url}/rest/v1/feedback?select=id,message,user_name,rating,created_at&published=eq.true&dismissed=eq.false&order=created_at.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const data = (await res.json()) as FeedbackRecord[];
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
