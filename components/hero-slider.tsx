"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Slide {
  title: string;
  body: string;
  imageUrl: string;
}

export function HeroSlider({ slides, cta }: { slides: Slide[]; cta?: { href: string; label: string } }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[index];

  return (
    <section className="section-wrap mt-8">
      <div className="hero-fade overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Visual Storytelling
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">{activeSlide.title}</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] md:text-base">{activeSlide.body}</p>
            {cta ? (
              <Link
                href={cta.href}
                className="mt-7 inline-flex w-fit rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
              >
                {cta.label}
              </Link>
            ) : null}
          </div>

          <div className="relative min-h-[280px] md:min-h-[460px]">
            <img
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
