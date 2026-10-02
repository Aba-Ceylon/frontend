"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import type { FleetVehicle } from "@/types/vehicle";
import { fetchVehicleById } from "@/services/fleetService";

type Props = {
  id: string;
  onClose: () => void;
};

export default function FleetDetailModal({ id, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const reqBtnRef = useRef<HTMLButtonElement | null>(null);
  const [vehicle, setVehicle] = useState<FleetVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadVehicle() {
      setIsLoading(true);
      try {
        const data = await fetchVehicleById(id);
        if (active) {
          setVehicle(data);
        }
      } catch {
        if (active) {
          setVehicle(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadVehicle();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.98, y: 20 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.36, ease: "power3.out" },
      );
    }, el);

    return () => ctx.revert();
  }, [id]);

  useEffect(() => {
    const btn = reqBtnRef.current;
    if (!btn) return;
    const tl = gsap.timeline({ paused: true });
    tl.to(
      btn,
      {
        backgroundColor: "#0b2545",
        color: "#fff",
        scale: 1.04,
        duration: 0.22,
        ease: "power2.out",
      },
      0,
    );
    const onEnter = () => tl.play();
    const onLeave = () => tl.reverse();
    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
      tl.kill();
    };
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [onClose]);

  if (!vehicle && !isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex min-h-full items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 my-auto flex max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="md:flex">
            <div className="relative h-56 md:h-auto md:w-1/2 shrink-0">
              {vehicle ? (
                <Image
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-200" />
              )}
            </div>
            <div className="p-5 sm:p-6 md:w-1/2">
              {isLoading || !vehicle ? (
                <p className="text-sm text-neutral-700">
                  Loading vehicle details...
                </p>
              ) : (
                <>
                  <h3 className="text-2xl font-cinzel text-[#0b2545] mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-neutral-700 mb-3">
                    {vehicle.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-neutral-700">
                    <div>
                      Type:{" "}
                      <strong className="text-neutral-900">{vehicle.type}</strong>
                    </div>
                    <div>
                      Passengers:{" "}
                      <strong className="text-neutral-900">
                        {vehicle.passengerCapacity}
                      </strong>
                    </div>
                    <div>
                      Luggage:{" "}
                      <strong className="text-neutral-900">
                        {vehicle.luggageCapacity}
                      </strong>
                    </div>
                  </div>

                  <ul className="list-disc pl-5 mb-4 text-sm text-neutral-700">
                    {vehicle.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="flex gap-3 items-center pt-2">
                <button
                  ref={reqBtnRef}
                  className="request-vehicle inline-flex px-5 py-2 rounded-full bg-amber-400 text-[#0b2545] font-semibold text-sm shadow-sm"
                  onClick={() => {
                    // intentionally no navigation; could open a form later
                  }}
                >
                  Request Vehicle
                </button>

                <button
                  className="ml-auto text-sm text-neutral-600 hover:text-neutral-900"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
