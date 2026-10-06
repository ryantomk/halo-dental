"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
  aspectRatioClass?: string;
}

export default function BeforeAfterSlider({
  beforeImage = "/images/hero-before.jpg",
  afterImage = "/images/hero-after.jpg",
  beforeAlt,
  afterAlt,
  aspectRatioClass = "aspect-[4/3] sm:aspect-[16/10]",
}: BeforeAfterSliderProps) {
  const t = useTranslations("showcase");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedBeforeAlt = beforeAlt || t("before");
  const resolvedAfterAlt = afterAlt || t("after");

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="relative mx-auto max-w-4xl select-none">
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-2xl border border-brand-charcoal/15 shadow-xl ${aspectRatioClass}`}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* After Image (Background layer) */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={afterImage}
            alt={resolvedAfterAlt}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            priority={false}
          />
          <span className="absolute bottom-4 right-4 rounded-md bg-brand-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-charcoal shadow-sm">
            {t("after")}
          </span>
        </div>

        {/* Before Image (Clipped overlay layer) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={resolvedBeforeAlt}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            priority={false}
          />
          <span className="absolute bottom-4 left-4 rounded-md bg-brand-midnight/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm">
            {t("before")}
          </span>
        </div>

        {/* Divider bar */}
        <div
          className="absolute inset-y-0 w-1 bg-white shadow-2xl transition-opacity pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-charcoal shadow-lg border-2 border-white">
            <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* Accessible range input for keyboard / screen readers */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          aria-label={t("sliderAria")}
          className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize focus-visible:opacity-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold"
        />
      </div>

      <p className="mt-3 text-center text-xs text-brand-charcoal/60">
        {t("sliderInstruction")}
      </p>
    </div>
  );
}
