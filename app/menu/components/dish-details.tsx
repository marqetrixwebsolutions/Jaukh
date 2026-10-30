"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import gsap from "gsap";
import type { MenuDish } from "../menu-data";
import styles from "../menu.module.css";

export interface DishSelection {
  dish: MenuDish;
  origin: DOMRect;
}

export function DishDetails({
  selection,
  onClose,
}: {
  selection: DishSelection | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const art = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const panel = dialog.current;
    if (!panel || !selection) return;
    panel.showModal();
    gsap.set(panel, { opacity: 1, x: 0 });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced || !art.current) return;
      const target = art.current.getBoundingClientRect();
      gsap.fromTo(
        art.current,
        {
          x: selection.origin.left - target.left,
          y: selection.origin.top - target.top,
          scaleX: selection.origin.width / target.width,
          scaleY: selection.origin.height / target.height,
          transformOrigin: "top left",
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.75,
          ease: "power3.inOut",
        },
      );
      gsap.from(panel.querySelectorAll("[data-detail-copy]"), {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        delay: 0.2,
        ease: "power2.out",
      });
    }, panel);
    return () => {
      ctx.revert();
      panel.close();
    };
  }, [selection]);

  const close = () => {
    if (
      !dialog.current ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onClose();
      return;
    }
    gsap.to(dialog.current, {
      x: 35,
      opacity: 0,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  return (
    <dialog
      ref={dialog}
      className={styles.detailDialog}
      aria-labelledby="dish-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {selection && (
        <div className={styles.detailContent}>
          <button
            type="button"
            className={styles.detailClose}
            onClick={close}
            aria-label="Close dish details"
          >
            <X size={21} />
          </button>
          <span className={styles.detailEyebrow} data-detail-copy>
            THE JOUKH MENU / {selection.dish.category.replace("-", " ")}
          </span>
          <div className={styles.detailArt}>
            <img
              ref={art}
              src={selection.dish.image}
              alt={selection.dish.name}
            />
          </div>
          <div className={styles.detailText}>
            <p className={styles.detailNote} data-detail-copy>
              {selection.dish.note}
            </p>
            <h2 id="dish-detail-title" data-detail-copy>
              {selection.dish.name}
            </h2>
            <p className={styles.detailDescription} data-detail-copy>
              {selection.dish.description}
            </p>
            <p className={styles.availability} data-detail-copy>
              Dish preview. Please ask our team about ingredients, allergens and
              availability.
            </p>
            <div className={styles.detailActions} data-detail-copy>
              <button type="button" onClick={close}>
                <ArrowLeft size={16} /> Back to exploring
              </button>
              <a href="/#experience">
                Visit Joukh <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
