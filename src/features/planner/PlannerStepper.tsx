"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { PlannerStep } from "@/types/planner";

interface PlannerStepperProps {
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  stepValidity: boolean[];
  steps: PlannerStep[];
}

export default function PlannerStepper({
  currentStep,
  onStepClick,
  stepValidity,
  steps,
}: PlannerStepperProps) {
  return (
    <Card variant="white" className="p-4 sm:p-6 shadow-[0_20px_50px_rgba(17,24,39,0.05)]">
      <div className="grid gap-3 lg:grid-cols-5">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = stepValidity[index];
          const isAccessible = stepValidity.slice(0, index).every(Boolean);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(index)}
              disabled={!isAccessible}
              className={`border px-4 py-4 text-left transition ${
                isActive
                  ? "border-[#bf9230]/70 bg-amber-50"
                  : isAccessible
                    ? "border-[#182231]/8 bg-[#fffdf8] hover:bg-[#f8f3ea]"
                    : "border-[#182231]/6 bg-[#f4ecdf]/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center font-cinzel text-sm ${
                    isActive || isCompleted
                      ? "bg-[#182231] text-white"
                      : "bg-[#f4ecdf] text-[#566173]"
                  }`}
                >
                  {index + 1}
                </span>
                <Badge
                  variant={isCompleted ? "green" : "light"}
                  className={
                    isCompleted
                      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                      : "border-[#182231]/8 bg-white text-[#6e7684]"
                  }
                >
                  {isCompleted ? "Ready" : "Pending"}
                </Badge>
              </div>
              <p className="font-cinzel text-lg text-[#182231]">{step.title}</p>
              <p className="mt-1 text-sm text-[#566173]">{step.caption}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
