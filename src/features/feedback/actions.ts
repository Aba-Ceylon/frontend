"use server";

import type { FeedbackInsertPayload, FeedbackRecord } from "@/types/feedback";

interface FeedbackPayload {
  rating: number;
  message: string;
  userName: string;
  userEmail: string;
}

function normalizeOptionalText(value: string) {
  const normalized = value.trim();
  return normalized.length ? normalized : null;
}

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<{ success: boolean; error?: string; feedback?: FeedbackRecord }> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!url || !key) {
      throw new Error(
        "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.",
      );
    }

    const rating = Number(payload.rating);
    const message = payload.message.trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        error: "Please choose a valid rating from 1 to 5.",
      };
    }

    if (message.length < 20) {
      return {
        success: false,
        error: "Please write at least 20 characters about your experience.",
      };
    }

    const feedbackPayload: FeedbackInsertPayload = {
      rating,
      message,
      user_name: normalizeOptionalText(payload.userName),
      user_email: normalizeOptionalText(payload.userEmail),
    };

    const response = await fetch(`${url}/rest/v1/feedback?select=*`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(feedbackPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase insert error:", errorText);
      return {
        success: false,
        error: "Unable to submit feedback right now. Please try again.",
      };
    }

    const insertedRows = (await response.json()) as FeedbackRecord[];
    return { success: true, feedback: insertedRows[0] };
  } catch (err) {
    console.error("submitFeedback error:", err);
    return { success: false, error: "Unexpected error. Please try again." };
  }
}
