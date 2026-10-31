import { createPageMetadata } from "@/lib/seo";
import { MenuExplorer } from "./components/menu-explorer";

export const metadata = createPageMetadata(
  "Menu",
  "Follow your appetite. Explore JOUKH’s curries, biryanis, grills and fresh bowls in an interactive menu.",
  "/menu",
);

export default function MenuPage() {
  return <MenuExplorer />;
}
