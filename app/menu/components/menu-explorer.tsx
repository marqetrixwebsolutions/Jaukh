"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LocateFixed, Menu, Move, X } from "lucide-react";
import {
  menuDishes,
  type MenuCategory,
  type MenuPreference,
} from "../menu-data";
import { DraggableMenuGrid } from "./draggable-menu-grid";
import { MenuFilters } from "./menu-filters";
import { DishDetails, type DishSelection } from "./dish-details";
import styles from "../menu.module.css";

export function MenuExplorer() {
  const [category, setCategory] = useState<MenuCategory>("all");
  const [preference, setPreference] = useState<MenuPreference>("all");
  const [resetKey, setResetKey] = useState(0);
  const [selection, setSelection] = useState<DishSelection | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dishes = useMemo(
    () =>
      menuDishes.filter(
        (dish) =>
          (category === "all" || dish.category === category) &&
          (preference === "all" || dish.preference === preference),
      ),
    [category, preference],
  );
  const reset = () => {
    setCategory("all");
    setPreference("all");
    setResetKey((key) => key + 1);
  };

  return (
    <main className={styles.menuPage}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Joukh home">
          <img
            src="/assests/Deep%20Purple%20Chef%20Emblem.png"
            alt=""
            width={42}
            height={42}
          />
          <span>
            JOUKH<small>INDIAN RESTAURANT</small>
          </span>
        </Link>
        <nav
          className={`${styles.navigation}${mobileNavOpen ? ` ${styles.navigationOpen}` : ""}`}
          aria-label="Main navigation"
        >
          <Link href="/" onClick={() => setMobileNavOpen(false)}>
             Our story
          </Link>
          <Link
            href="/menu"
            aria-current="page"
            onClick={() => setMobileNavOpen(false)}
          >
            The menu
          </Link>
          <Link href="/#story" onClick={() => setMobileNavOpen(false)}>
         The experience
          </Link>
        </nav>
        <Link className={styles.homeLink} href="/">
          RESERVE A TABLE <ArrowUpRight size={15} />
        </Link>
        <button
          className={styles.mobileToggle}
          type="button"
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>FOLLOW YOUR APPETITE</p>
          <h1>A world of flavour.</h1>
        </div>
        <p className={styles.introNote}>
          A little familiar. A little unexpected.
          <br />
          Find your next favourite.
        </p>
      </div>
      <DraggableMenuGrid
        dishes={dishes}
        resetKey={resetKey}
        onSelect={(dish, origin) => setSelection({ dish, origin })}
      />
      {dishes.length === 0 && (
        <div className={styles.emptyState}>
          <span>Nothing in this little corner.</span>
          <h2>A different craving?</h2>
          <p>Try another category or explore the whole menu.</p>
          <button type="button" onClick={reset}>
            Show all dishes <ArrowUpRight size={16} />
          </button>
        </div>
      )}
   
      <MenuFilters
        category={category}
        preference={preference}
        onCategory={setCategory}
        onPreference={setPreference}
      />
      <DishDetails selection={selection} onClose={() => setSelection(null)} />
    </main>
  );
}
