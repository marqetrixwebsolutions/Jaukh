import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingImageProps {
  src: string;
  alt: string;
  className: string;
  entrance?: "left" | "right" | "top" | "bottom";
}

export interface FloatingFoodHeroProps {
  title: ReactNode;
  description: string;
  images: FloatingImageProps[];
  className?: string;
  children?: ReactNode;
  id?: string;
  variant?: "floating" | "editorial";
  logoSrc?: string;
}

function Swirls() {
  return (
    <div className="hero-swirls" aria-hidden="true">
      <svg
        className="swirl-left"
        width="600"
        height="600"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path
          d="M515.266 181.33C377.943 51.564 128.537 136.256 50.8123 293.565C-26.9127 450.874 125.728 600 125.728 600"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="swirl-right"
        width="700"
        height="700"
        viewBox="0 0 700 700"
        fill="none"
      >
        <path
          d="M26.8838 528.274C193.934 689.816 480.051 637.218 594.397 451.983C708.742 266.748 543.953 2.22235 543.953 2.22235"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Floating-food hero adapted from the supplied hero-section-7 component. */
export function FloatingFoodHero({
  title,
  description,
  images,
  className,
  children,
  id,
  variant = "floating",
  logoSrc,
}: FloatingFoodHeroProps) {
  return (
    <section
      id={id}
      className={cn(
        "hero floating-food-hero",
        variant === "editorial" && "editorial-hero",
        className,
      )}
      aria-labelledby="welcome-title"
    >
      <Swirls />
      <div className="floating-images" aria-hidden="true">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={cn("floating-image-position", image.className)}
            data-entrance={
              image.entrance ?? (index % 2 === 0 ? "left" : "right")
            }
          >
            <img
              src={image.src}
              alt={image.alt}
              className="floating-food-image"
              style={{ animationDelay: `${index * -0.8}s` }}
            />
          </div>
        ))}
      </div>
      <div className="floating-hero-content">
        {logoSrc && (
          <div className="hero-logo-slot" aria-hidden="true">
            <img
              className="hero-center-emblem"
              src={logoSrc}
              alt=""
              width={176}
              height={176}
            />
          </div>
        )}
        {/* <div className="eyebrow hero-reveal">
          <span className="tiny-star">✳</span> ROOTED IN TRADITION. MADE FOR
          TODAY.
        </div> */}
        <h1 id="welcome-title" className="hero-reveal">
          {title}
        </h1>
        <p className="hero-description hero-reveal">{description}</p>
        {children}
      </div>
    </section>
  );
}
