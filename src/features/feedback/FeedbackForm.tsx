"use client";

import { useReducer } from "react";
import { useUser } from "@clerk/nextjs";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { submitFeedback } from "@/features/feedback/actions";

type Status = "idle" | "loading" | "success" | "error";
type State = { rating: number; hovered: number; message: string; status: Status; errorMsg: string };
type Action =
  | { type: "SET_RATING"; value: number }
  | { type: "SET_HOVERED"; value: number }
  | { type: "SET_MESSAGE"; value: string }
  | { type: "SET_STATUS"; status: Status; errorMsg?: string }
  | { type: "RESET" };

const INITIAL: State = { rating: 0, hovered: 0, message: "", status: "idle", errorMsg: "" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_RATING": return { ...state, rating: action.value };
    case "SET_HOVERED": return { ...state, hovered: action.value };
    case "SET_MESSAGE": return { ...state, message: action.value };
    case "SET_STATUS": return { ...state, status: action.status, errorMsg: action.errorMsg ?? "" };
    case "RESET": return INITIAL;
    default: return state;
  }
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function FeedbackForm() {
  const { user } = useUser();
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const { rating, hovered, message, status, errorMsg } = state;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { dispatch({ type: "SET_STATUS", status: "idle", errorMsg: "Please select a rating" }); return; }
    if (message.trim().length < 20) { dispatch({ type: "SET_STATUS", status: "idle", errorMsg: "Message must be at least 20 characters" }); return; }

    dispatch({ type: "SET_STATUS", status: "loading" });
    const result = await submitFeedback({
      rating,
      message: message.trim(),
      userName: user?.fullName ?? user?.username ?? "Anonymous",
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
    });

    if (result.success) {
      dispatch({ type: "SET_STATUS", status: "success" });
    } else {
      dispatch({ type: "SET_STATUS", status: "error", errorMsg: result.error ?? "An error occurred. Please try again." });
    }
  }

  return (
    <div
      className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-2xl border border-amber-400/20 shadow-2xl p-8 max-w-xl w-full mx-auto"
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-px bg-amber-400/50" />
        {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />)}
        <div className="w-12 h-px bg-amber-400/50" />
      </div>

      <h2 className="font-cinzel text-2xl text-amber-400 text-center mb-1 drop-shadow-[0_0_20px_rgba(201,154,43,0.4)]">
        Share Your Feedback
      </h2>
      <p className="text-slate-400 text-sm text-center mb-8 font-cinzel">
        We value your opinion and would love to hear about your experience
      </p>

      {status === "success" ? (
        <div className="text-center py-8">
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={28} className="text-amber-400 fill-amber-400" />)}
          </div>
          <p className="font-cinzel text-amber-400 text-lg mb-2">Thank You!</p>
          <p className="text-slate-400 text-sm">Your feedback has been submitted successfully</p>
          <Button variant="outline" size="sm" onClick={() => dispatch({ type: "RESET" })} className="mt-6 border-amber-400/40 text-amber-400 hover:bg-amber-400/10">
            Submit Another Review
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-cinzel text-sm text-slate-300 mb-3">Rate Your Experience</label>
            <div className="flex gap-2" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star} type="button"
                  onClick={() => dispatch({ type: "SET_RATING", value: star })}
                  onMouseEnter={() => dispatch({ type: "SET_HOVERED", value: star })}
                  onMouseLeave={() => dispatch({ type: "SET_HOVERED", value: 0 })}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                >
                  <Star size={32} className={`transition-colors ${star <= (hovered || rating) ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-xs text-amber-400/70 mt-1 font-cinzel">{RATING_LABELS[rating]}</p>}
          </div>

          <div>
            <label htmlFor="feedback-message" className="block font-cinzel text-sm text-slate-300 mb-2">
              Tell us about your experience
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => dispatch({ type: "SET_MESSAGE", value: e.target.value })}
              rows={5} maxLength={600}
              placeholder="Share your thoughts about our service..."
              className="w-full bg-slate-800/60 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 resize-none transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1 text-right">{message.length}/600</p>
          </div>

          {errorMsg && <p className="text-red-400 text-sm font-cinzel">{errorMsg}</p>}

          <Button
            type="submit"
            disabled={status === "loading"}
            fullWidth
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-bold border border-amber-300 shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 normal-case tracking-normal"
          >
            {status === "loading" ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      )}
    </div>
  );
}
