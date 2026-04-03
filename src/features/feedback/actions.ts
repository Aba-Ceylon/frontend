"use server";

import { getSupabaseClient } from "@/lib/supabase/client";

interface FeedbackPayload {
  rating: number;
  message: string;
  userName: string;
  userEmail: string;
}

export async function submitFeedback(
  payload: FeedbackPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("feedback").insert({
      rating: payload.rating,
      message: payload.message,
      user_name: payload.userName,
      user_email: payload.userEmail,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("submitFeedback error:", err);
    return { success: false, error: "Unexpected error. Please try again." };
  }
}
