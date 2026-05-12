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

export default function PlannerStepper({ currentStep, onStepClick, stepValidity, steps }: PlannerStepperProps) {
  return (
    <Card variant="dark" className="p-4 sm:p-6 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
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
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? "border-amber-400/80 bg-amber-400/10"
                  : isAccessible
                    ? "border-white/10 bg-white/5 hover:bg-white/8"
                    : "border-white/5 bg-white/[0.03] opacity-55 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full font-cinzel text-sm ${isActive || isCompleted ? "bg-amber-400 text-[#0F172A]" : "bg-white/10 text-white/80"}`}>
                  {index + 1}
                </span>
                <Badge
                  variant={isCompleted ? "green" : "dark"}
                  className={isCompleted ? "text-emerald-300 bg-transparent border-emerald-400/30" : "text-white/40 bg-transparent border-white/10"}
                >
                  {isCompleted ? "Ready" : "Pending"}
                </Badge>
              </div>
              <p className="font-cinzel text-white text-lg">{step.title}</p>
              <p className="text-sm text-white/60 mt-1">{step.caption}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
