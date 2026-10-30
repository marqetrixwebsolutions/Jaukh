import {
  categories,
  preferences,
  type MenuCategory,
  type MenuPreference,
} from "../menu-data";
import styles from "../menu.module.css";

interface MenuFiltersProps {
  category: MenuCategory;
  preference: MenuPreference;
  onCategory: (value: MenuCategory) => void;
  onPreference: (value: MenuPreference) => void;
}

export function MenuFilters({
  category,
  preference,
  onCategory,
  onPreference,
}: MenuFiltersProps) {
  return (
    <div className={styles.filterDock} aria-label="Filter the menu">
      <div
        className={styles.categoryFilters}
        role="group"
        aria-label="Dish category"
      >
        {categories.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={category === item.id}
            className={category === item.id ? styles.categoryActive : ""}
            onClick={() => onCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <span className={styles.filterDivider} aria-hidden="true" />
      <div
        className={styles.preferenceFilters}
        role="group"
        aria-label="Dish preference"
      >
        {preferences.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={preference === item.id}
            className={preference === item.id ? styles.preferenceActive : ""}
            onClick={() => onPreference(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
