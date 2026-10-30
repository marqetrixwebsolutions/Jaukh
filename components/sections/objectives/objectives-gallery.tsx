"use client";

// Image counter-motion adapted from David Faure / Codrops' horizontal gallery.
// See THIRD_PARTY_NOTICES.txt in this directory.
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { objectives } from "./objectives-data";
import styles from "./objectives.module.css";

export function ObjectivesSection({ onReserve }: { onReserve: () => void }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);
  const navigate = useRef<((index: number) => void) | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = section.current;
    const pinned = stage.current;
    const frame = viewport.current;
    const rail = track.current;
    if (!root || !pinned || !frame || !rail) return;
    gsap.registerPlugin(ScrollTrigger);
    const images = Array.from(
      rail.querySelectorAll<HTMLImageElement>("[data-objective-image]"),
    );
    const setImageX = images.map((image) =>
      gsap.quickSetter(image, "xPercent"),
    );
    const updateCounter = (progress: number) => {
      const next = Math.min(
        objectives.length - 1,
        Math.round(progress * (objectives.length - 1)),
      );
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      if (progressBar.current)
        progressBar.current.style.transform = `scaleX(${progress})`;
      root.dataset.progress = progress.toFixed(3);
    };
    const parallax = () => {
      const center = frame.clientWidth / 2;
      images.forEach((image, index) => {
        const rect = image.parentElement!.getBoundingClientRect();
        const relative = gsap.utils.clamp(
          -1,
          1,
          (rect.left + rect.width / 2 - center) / center,
        );
        setImageX[index](-relative * 10);
      });
    };
    const maxTravel = () => {
      const lastCard = rail.lastElementChild;
      if (!(lastCard instanceof HTMLElement)) return 0;
      const railBounds = rail.getBoundingClientRect();
      const lastCardBounds = lastCard.getBoundingClientRect();
      const rightPadding =
        Number.parseFloat(getComputedStyle(rail).paddingRight) || 0;
      const lastCardRight = lastCardBounds.right - railBounds.left;
      return Math.max(
        0,
        lastCardRight + rightPadding - frame.clientWidth,
      );
    };
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 768px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
      () => {
        root.dataset.mode = "pinned";
        frame.scrollLeft = 0;
        const distance = () => Math.max(window.innerWidth * 1.3, maxTravel());
        const sizeSection = () => {
          // Reserve the scroll distance in normal document flow. CSS sticky
          // keeps the stage inside this section while earlier pins refresh.
          root.style.height = `${pinned.offsetHeight + distance()}px`;
        };
        sizeSection();
        const tween = gsap.to(rail, {
          x: () => -maxTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 90px",
            end: () => `+=${distance()}`,
            // Measure after the page's earlier pins add their spacing.
            refreshPriority: -10,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefreshInit: sizeSection,
            onUpdate: (self) => {
              updateCounter(self.progress);
              parallax();
            },
            onRefresh: (self) => {
              root.dataset.scrollStart = String(self.start);
              root.dataset.scrollEnd = String(self.end);
              parallax();
            },
          },
          onUpdate: parallax,
        });
        navigate.current = (index) => {
          const trigger = tween.scrollTrigger;
          if (!trigger) return;
          const progress =
            gsap.utils.clamp(0, objectives.length - 1, index) /
            (objectives.length - 1);
          window.scrollTo({
            top: trigger.start + (trigger.end - trigger.start) * progress,
            behavior: "smooth",
          });
        };
        parallax();
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(rail, { clearProps: "transform" });
          root.style.height = "";
          navigate.current = null;
        };
      },
    );
    media.add(
      "(max-width: 767px), (max-height: 699px), (prefers-reduced-motion: reduce)",
      () => {
        root.dataset.mode = "native";
        frame.setAttribute("data-lenis-prevent", "");
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const update = () => {
          updateCounter(maxTravel() ? frame.scrollLeft / maxTravel() : 0);
          if (!reduced) parallax();
        };
        navigate.current = (index) =>
          frame.scrollTo({
            left:
              (maxTravel() *
                gsap.utils.clamp(0, objectives.length - 1, index)) /
              (objectives.length - 1),
            behavior: reduced ? "auto" : "smooth",
          });
        frame.addEventListener("scroll", update, { passive: true });
        const resize = new ResizeObserver(update);
        resize.observe(frame);
        update();
        return () => {
          frame.removeEventListener("scroll", update);
          frame.removeAttribute("data-lenis-prevent");
          resize.disconnect();
          navigate.current = null;
          images.forEach((image) => {
            image.style.transform = "";
          });
        };
      },
    );
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    return () => {
      media.revert();
      delete root.dataset.mode;
    };
  }, []);

  return (
    <>
      <section
        ref={section}
        id="objectives"
        className={styles.section}
        aria-labelledby="objectives-title"
      >
        <div ref={stage} className={styles.stage}>
          <header className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>OUR OBJECTIVES</p>
              <h2 id="objectives-title">
                Better, <span>every day.</span>
              </h2>
            </div>
          
          </header>
          <div
            ref={viewport}
            className={styles.viewport}
            tabIndex={0}
            role="region"
            aria-label="Seven Joukh objectives. Use left and right arrow keys to explore."
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                navigate.current?.(
                  activeRef.current + (event.key === "ArrowRight" ? 1 : -1),
                );
              }
            }}
          >
            <ol ref={track} className={styles.track}>
              {objectives.map((objective, index) => (
                <li
                  key={objective.title}
                  className={styles.panel}
                  data-objective-card
                >
                  <div className={styles.imageFrame}>
                    <img
                      data-objective-image
                      src={objective.image}
                      alt={objective.alt}
                      style={{ objectPosition: objective.position }}
                      loading="lazy"
                    />
                    <div className={styles.imageShade} />
                    <span className={styles.photoTag}>{objective.theme}</span>
                  </div>
                  <div className={styles.caption}>
                    <div className={styles.cardHeading}>
                      
                      <h3>{objective.title}</h3>
                    </div>
                    <p>{objective.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
     
        </div>
      </section>
      <section
        id="reserve"
        className={styles.cta}
        aria-labelledby="objectives-cta-title"
      >
        <p className={styles.eyebrow}>THERE’S A PLACE FOR YOU HERE</p>
        <h2 id="objectives-cta-title">
          Good food brings
          <br />
          <span>people together.</span>
        </h2>
        <p className={styles.ctaDescription}>
          Make a little room for a memorable meal.
        </p>
        <button
          type="button"
          className={styles.reserveButton}
          onClick={onReserve}
        >
          Reserve your table <ArrowUpRight size={18} />
        </button>
        <p className={styles.ctaDetail}>
          FAMILY DINNERS · LONG CONVERSATIONS · JUST BECAUSE
        </p>
      </section>
    </>
  );
}
