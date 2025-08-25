"use client";
import { useKeenSlider } from "keen-slider/react";
import { useEffect } from "react";
import "keen-slider/keen-slider.min.css";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

export function AutoCarousel({ items, type }: { items: any[]; type: "product" | "category" }) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
    },
  });

  // autoplay
  useEffect(() => {
    if (!slider) return;
    let timer: any;
    function autoplay() {
      timer = setInterval(() => {
        slider.current?.next();
      }, 3000);
    }
    autoplay();
    return () => clearInterval(timer);
  }, [slider]);

  return (
    <div ref={sliderRef} className="keen-slider">
      {items.map((item, i) => (
        <div key={i} className="keen-slider__slide">
          {type === "product" ? (
            <ProductCard {...item} />
          ) : (
            <Link
              href={item.href}
              className="block aspect-square rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white font-heading font-bold text-lg">{item.name}</h3>
              </div>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
