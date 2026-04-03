export interface FeedbackRecord {
  id: string;
  rating: number;
  message: string;
  user_name: string | null;
  user_email: string | null;
  published: boolean;
  dismissed: boolean;
  created_at: string;
}

export interface FeedbackInsertPayload {
  rating: number;
  message: string;
  user_name?: string | null;
  user_email?: string | null;
}
