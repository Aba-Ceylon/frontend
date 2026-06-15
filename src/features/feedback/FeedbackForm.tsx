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
  const userDisplayName = user?.fullName ?? user?.username ?? "Guest traveller";

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
    <div className="w-full bg-[#FBF8F2] text-[#182231]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="border-b border-[#182231]/10 bg-[#182231] px-6 py-8 text-white sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
          <p className="font-cinzel text-[11px] uppercase tracking-[0.28em] text-[#C99A2B]">
            Guest feedback
          </p>
          <h2 className="mt-5 font-cinzel text-3xl leading-[1.04] sm:text-[2.5rem]">
            Tell us how
            <br />
            the journey felt.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/72 sm:text-[15px]">
            Your review helps us refine routes, support, and timing for the
            next traveller.
          </p>

          <div className="mt-6 border border-white/10 px-5 py-4">
            <p className="font-cinzel text-[10px] uppercase tracking-[0.24em] text-[#C99A2B]">
              Signed in as
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-white/84">
              {userDisplayName}
            </p>
            <p className="mt-4 text-sm leading-6 text-white/62">
              Published reviews are moderated before appearing on the site.
            </p>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {status === "success" ? (
            <div className="flex h-full flex-col justify-center">
              <p className="font-cinzel text-[11px] uppercase tracking-[0.28em] text-[#8B6B1F]">
                Feedback received
              </p>
              <h3 className="mt-4 font-cinzel text-3xl leading-[1.08] text-[#182231]">
                Thank you for
                <br />
                writing to us.
              </h3>
              <div className="mt-6 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="fill-[#C99A2B] text-[#C99A2B]"
                  />
                ))}
              </div>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#445062]">
                Your review has been submitted successfully and will be reviewed
                before publication.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => dispatch({ type: "RESET" })}
                className="mt-6 w-full sm:w-auto"
              >
                Submit Another Review
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="font-cinzel text-[11px] uppercase tracking-[0.28em] text-[#8B6B1F]">
                  Leave a review
                </p>
                <h3 className="mt-4 font-cinzel text-[2rem] leading-[1.08] text-[#182231]">
                  Share the parts
                  <br />
                  that stood out.
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#445062]">
                  A short note about planning, transport, communication, or the
                  overall route is enough.
                </p>
              </div>

              <div className="border-t border-[#182231]/10 pt-5">
                <label className="block font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231]">
                  Rate your experience
                </label>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = star <= (hovered || rating);

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => dispatch({ type: "SET_RATING", value: star })}
                        onMouseEnter={() => dispatch({ type: "SET_HOVERED", value: star })}
                        onMouseLeave={() => dispatch({ type: "SET_HOVERED", value: 0 })}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        className={`inline-flex h-12 w-12 items-center justify-center border transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A2B]/40 ${
                          isActive
                            ? "border-[#C99A2B] bg-[#182231] text-[#C99A2B]"
                            : "border-[#182231]/12 bg-white text-[#8D96A2] hover:border-[#C99A2B]/50 hover:text-[#8B6B1F]"
                        }`}
                      >
                        <Star
                          size={20}
                          className={isActive ? "fill-current" : ""}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="font-cinzel text-xs uppercase tracking-[0.18em] text-[#8B6B1F]">
                    {rating > 0 ? RATING_LABELS[rating] : "Select a rating"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">
                    1 to 5 stars
                  </p>
                </div>
              </div>

              <div className="border-t border-[#182231]/10 pt-5">
                <label
                  htmlFor="feedback-message"
                  className="block font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#182231]"
                >
                  Your note
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => dispatch({ type: "SET_MESSAGE", value: e.target.value })}
                  rows={5}
                  maxLength={600}
                  placeholder="Tell us what felt smooth, what could improve, or what you would recommend to another traveller."
                  className="mt-3 w-full border border-[#182231]/12 bg-white px-4 py-3 text-sm leading-7 text-[#182231] placeholder:text-[#7A8391] focus:border-[#C99A2B] focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-xs leading-5 text-[#6B7280]">
                    Minimum 20 characters. Clear, honest detail helps most.
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">
                    {message.length}/600
                  </p>
                </div>
              </div>

              {errorMsg ? (
                <div className="border border-[#C99A2B]/28 bg-[#F6EEDC] px-4 py-3 text-sm text-[#6F4F10]">
                  {errorMsg}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-[#6B7280]">
                  Reviews are reviewed before they are shown publicly.
                </p>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {status === "loading" ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
