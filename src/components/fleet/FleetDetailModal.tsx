"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import vehicles from "@/data/vehicles";

type Props = {
  id: string;
  onClose: () => void;
};

export default function FleetDetailModal({ id, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const reqBtnRef = useRef<HTMLButtonElement | null>(null);

  const vehicle = vehicles.find((v) => v.id === id) ?? null;

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { autoAlpha: 0, scale: 0.98, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.36, ease: "power3.out" });
    }, el);

    return () => ctx.revert();
  }, [id]);

  useEffect(() => {
    const btn = reqBtnRef.current;
    if (!btn) return;
    const tl = gsap.timeline({ paused: true });
    tl.to(btn, { backgroundColor: "#0b2545", color: "#fff", scale: 1.04, duration: 0.22, ease: "power2.out" }, 0);
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
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="relative z-70 max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="relative md:w-1/2 h-52 md:h-auto">
            <Image src={vehicle.imageUrl} alt={vehicle.name} fill className="object-cover" />
          </div>
          <div className="p-6 md:w-1/2">
            <h3 className="text-2xl font-cinzel text-[#0b2545] mb-2">{vehicle.name}</h3>
            <p className="text-sm text-neutral-700 mb-3">{vehicle.shortDescription}</p>

            <div className="flex gap-4 mb-3 text-sm text-neutral-700">
              <div>Type: <strong className="text-neutral-900">{vehicle.type}</strong></div>
              <div>Passengers: <strong className="text-neutral-900">{vehicle.passengerCapacity}</strong></div>
              <div>Luggage: <strong className="text-neutral-900">{vehicle.luggageCapacity}</strong></div>
            </div>

            <ul className="list-disc pl-5 mb-4 text-sm text-neutral-700">
              {vehicle.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <div className="flex gap-3 items-center">
              <button
                ref={reqBtnRef}
                className="request-vehicle inline-flex px-5 py-2 rounded-full bg-amber-400 text-[#0b2545] font-semibold"
                onClick={() => {
                  // intentionally no navigation; could open a form later
                }}
              >
                Request Vehicle
              </button>

              <button className="ml-auto text-sm text-neutral-600 hover:text-neutral-900" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
