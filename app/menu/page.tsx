import type { Metadata } from "next";
import { MenuExplorer } from "./components/menu-explorer";

export const metadata: Metadata = {
  title: "The Menu — JOUKH Restaurant",
  description:
    "Follow your appetite. Explore Joukh’s curries, biryanis, grills and fresh bowls in an interactive menu.",
};

export default function MenuPage() {
  return <MenuExplorer />;
}
