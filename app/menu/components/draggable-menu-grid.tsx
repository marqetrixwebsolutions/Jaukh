"use client";

// Adapted from joffreysp/draggable-grid (Codrops, MIT). See ../THIRD_PARTY_NOTICES.txt.
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { MenuDish } from "../menu-data";
import styles from "../menu.module.css";

interface DraggableMenuGridProps {
  dishes: MenuDish[];
  onSelect: (dish: MenuDish, origin: DOMRect) => void;
  resetKey: number;
}

export function DraggableMenuGrid({
  dishes,
  onSelect,
  resetKey,
}: DraggableMenuGridProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const draggable = useRef<Draggable | null>(null);
  const lastDrag = useRef(-Infinity);
  const columnCount =
    dishes.length > 8 ? 5 : dishes.length > 4 ? 3 : Math.min(2, dishes.length);
  const columns = Array.from({ length: columnCount }, (_, index) =>
    dishes.filter((_, i) => i % columnCount === index),
  );

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const board = boardRef.current;
    if (!viewport || !board || !dishes.length) return;
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bounds = () => {
      const dx = viewport.clientWidth - board.offsetWidth;
      const dy = viewport.clientHeight - board.offsetHeight;
      return {
        minX: dx < 0 ? dx - 65 : dx / 2,
        maxX: dx < 0 ? 65 : dx / 2,
        minY: dy < 0 ? dy - 55 : dy / 2,
        maxY: dy < 0 ? 55 : dy / 2,
      };
    };
    const center = () => {
      gsap.killTweensOf(board);
      gsap.set(board, {
        x: (viewport.clientWidth - board.offsetWidth) / 2,
        y: (viewport.clientHeight - board.offsetHeight) / 2,
      });
      draggable.current?.applyBounds(bounds());
      draggable.current?.update();
    };
    center();
    const instance = Draggable.create(board, {
      type: "x,y",
      bounds: bounds(),
      inertia: !reduced,
      edgeResistance: 0.85,
      dragResistance: 0.12,
      minimumMovement: 7,
      dragClickables: true,
      onDragStart() {
        board.dataset.dragging = "true";
        gsap.killTweensOf(board);
      },
      onDragEnd() {
        lastDrag.current = performance.now();
        delete board.dataset.dragging;
      },
    })[0];
    draggable.current = instance;
    const pan = (dx: number, dy: number) => {
      const b = bounds();
      gsap.to(board, {
        x: gsap.utils.clamp(
          b.minX,
          b.maxX,
          Number(gsap.getProperty(board, "x")) + dx,
        ),
        y: gsap.utils.clamp(
          b.minY,
          b.maxY,
          Number(gsap.getProperty(board, "y")) + dy,
        ),
        duration: reduced ? 0 : 0.35,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => instance.update(),
      });
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      pan(-event.deltaX * 0.9, -event.deltaY * 0.9);
    };
    const key = (event: globalThis.KeyboardEvent) => {
      const deltas: Record<string, [number, number]> = {
        ArrowLeft: [110, 0],
        ArrowRight: [-110, 0],
        ArrowUp: [0, 110],
        ArrowDown: [0, -110],
      };
      if (deltas[event.key]) {
        event.preventDefault();
        pan(...deltas[event.key]);
      }
      if (event.key === "Home") {
        event.preventDefault();
        center();
      }
    };
    viewport.addEventListener("wheel", wheel, { passive: false });
    viewport.addEventListener("keydown", key);
    const resize = new ResizeObserver(center);
    resize.observe(viewport);
    const intro = gsap.fromTo(
      board.querySelectorAll("[data-dish-art]"),
      { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.75 },
      {
        opacity: 1,
        scale: 1,
        duration: reduced ? 0 : 0.65,
        stagger: reduced ? 0 : { amount: 0.5, from: "center" },
        ease: "power3.out",
      },
    );
    return () => {
      intro.kill();
      instance.kill();
      draggable.current = null;
      resize.disconnect();
      gsap.killTweensOf(board);
      viewport.removeEventListener("wheel", wheel);
      viewport.removeEventListener("keydown", key);
    };
  }, [dishes, resetKey]);

  const revealFocusedCard = (element: HTMLButtonElement) => {
    const viewport = viewportRef.current;
    const board = boardRef.current;
    const instance = draggable.current;
    if (!viewport || !board || !instance || instance.isDragging) return;
    const card = element.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    if (
      card.left >= frame.left &&
      card.right <= frame.right &&
      card.top >= frame.top &&
      card.bottom <= frame.bottom
    )
      return;
    const b = instance.vars.bounds as {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
    gsap.to(board, {
      x: gsap.utils.clamp(
        b.minX,
        b.maxX,
        Number(gsap.getProperty(board, "x")) +
          frame.left +
          frame.width / 2 -
          card.left -
          card.width / 2,
      ),
      y: gsap.utils.clamp(
        b.minY,
        b.maxY,
        Number(gsap.getProperty(board, "y")) +
          frame.top +
          frame.height / 2 -
          card.top -
          card.height / 2,
      ),
      duration: 0.25,
      overwrite: true,
      onUpdate: () => instance.update(),
    });
  };

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      tabIndex={0}
      role="region"
      aria-label="Draggable dish gallery. Drag or use arrow keys to explore. Press Home to recenter."
    >
      <div ref={boardRef} className={styles.board} data-menu-board>
        {columns.map((column, index) => (
          <div key={index} className={styles.column}>
            {column.map((dish) => (
              <button
                key={dish.id}
                type="button"
                className={styles.dishCard}
                data-dish-id={dish.id}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible"))
                    revealFocusedCard(event.currentTarget);
                }}
                onClick={(event) => {
                  if (
                    draggable.current?.isDragging ||
                    performance.now() - lastDrag.current < 220
                  )
                    return;
                  onSelect(
                    dish,
                    event.currentTarget
                      .querySelector("img")!
                      .getBoundingClientRect(),
                  );
                }}
              >
                <span className={styles.dishArt} data-dish-art>
                  <img src={dish.image} alt={dish.name} draggable={false} />
                  <span className={styles.openDish} aria-hidden="true">
                    ↗
                  </span>
                </span>
                <span className={styles.cardCaption}>
                  <span>{dish.name}</span>
                  <small>{dish.category.replace("-", " ")}</small>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
