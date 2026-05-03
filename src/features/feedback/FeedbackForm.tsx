"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { submitFeedback } from "@/features/feedback/actions";

export default function FeedbackForm() {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg("Please select a rating");
      return;
    }
    if (message.trim().length < 20) {
      setErrorMsg("Message must be at least 20 characters");
      return;
    }

    setErrorMsg("");
    setStatus("loading");

    const result = await submitFeedback({
      rating,
      message: message.trim(),
      userName: user?.fullName ?? user?.username ?? "Anonymous",
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
    });

    if (result.success) {
      setStatus("success");
      setRating(0);
      setMessage("");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "An error occurred. Please try again.");
    }
  }

  return (
    <div
      className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md rounded-2xl border border-amber-400/20 shadow-2xl p-8 max-w-xl w-full mx-auto"
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
    >
      {/* Decorative top divider */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-px bg-amber-400/50" />
        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
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
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={28}
                className="text-amber-400 fill-amber-400"
              />
            ))}
          </div>
          <p className="font-cinzel text-amber-400 text-lg mb-2">
            Thank You!
          </p>
          <p className="text-slate-400 text-sm">
            Your feedback has been submitted successfully
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 font-cinzel text-sm px-6 py-2 rounded-lg border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 transition-colors"
          >
            Submit Another Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block font-cinzel text-sm text-slate-300 mb-3">
              Rate Your Experience
            </label>
            <div className="flex gap-2" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= (hovered || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-amber-400/70 mt-1 font-cinzel">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="feedback-message"
              className="block font-cinzel text-sm text-slate-300 mb-2"
            >
              Tell us about your experience
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={600}
              placeholder="Share your thoughts about our service..."
              className="w-full bg-slate-800/60 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 resize-none transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1 text-right">
              {message.length}/600
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-red-400 text-sm font-cinzel">{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-bold font-cinzel py-3 rounded-lg border border-amber-300 shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {status === "loading" ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
