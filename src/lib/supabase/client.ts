import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseDestinationRow } from "@/types/destination";
import type { SupabasePackageRow } from "@/types/package";
import type { SupabaseAccommodationRow } from "@/types/stay";
import type { SupabaseVehicleRow } from "@/types/vehicle";

interface FeedbackRow {
  id?: string | number;
  rating: number;
  message: string;
  user_name: string;
  user_email: string;
  published?: boolean | null;
  created_at: string;
}

type AppDatabase = {
  public: {
    Tables: {
      accommodations: {
        Row: SupabaseAccommodationRow;
        Insert: Partial<SupabaseAccommodationRow>;
        Update: Partial<SupabaseAccommodationRow>;
        Relationships: [];
      };
      destinations: {
        Row: SupabaseDestinationRow;
        Insert: Partial<SupabaseDestinationRow>;
        Update: Partial<SupabaseDestinationRow>;
        Relationships: [];
      };
      feedback: {
        Row: FeedbackRow;
        Insert: FeedbackRow;
        Update: Partial<FeedbackRow>;
        Relationships: [];
      };
      packages: {
        Row: SupabasePackageRow;
        Insert: Partial<SupabasePackageRow>;
        Update: Partial<SupabasePackageRow>;
        Relationships: [];
      };
      vehicles: {
        Row: SupabaseVehicleRow;
        Insert: Partial<SupabaseVehicleRow>;
        Update: Partial<SupabaseVehicleRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let client: SupabaseClient<AppDatabase> | null = null;

export function getSupabaseClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.",
    );
  }

  client = createClient<AppDatabase>(supabaseUrl, supabaseAnonKey);
  return client;
}
