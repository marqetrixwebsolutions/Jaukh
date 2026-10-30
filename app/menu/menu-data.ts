export type MenuCategory =
  "all" | "curries" | "rice" | "grills" | "salads" | "small-plates";
export type MenuPreference = "all" | "vegetarian" | "chicken" | "seafood";

export interface MenuDish {
  id: string;
  name: string;
  category: Exclude<MenuCategory, "all">;
  preference: Exclude<MenuPreference, "all"> | "other";
  image: string;
  description: string;
  note: string;
  colour: string;
}

const asset = (name: string) => `/assests/${encodeURIComponent(name)}.png`;

export const categories: { id: MenuCategory; label: string }[] = [
  { id: "all", label: "All dishes" },
  { id: "curries", label: "Curries" },
  { id: "rice", label: "Rice" },
  { id: "grills", label: "Grills" },
  { id: "salads", label: "Salads" },
  { id: "small-plates", label: "Small plates" },
];
export const preferences: { id: MenuPreference; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "chicken", label: "Chicken" },
  { id: "seafood", label: "Seafood" },
];

// Dish previews use the supplied food imagery; no prices or availability are inferred.
export const menuDishes: MenuDish[] = [
  {
    id: "cashew-biryani",
    name: "Chicken & cashew biryani",
    category: "rice",
    preference: "chicken",
    image: asset("Vibrant Chicken Biryani Bowl with Cashews"),
    description:
      "Colourful rice, chicken and golden cashews. A generous bowl made for a leisurely meal.",
    note: "Fragrant rice · Golden cashews",
    colour: "#f3e9d9",
  },
  {
    id: "kebabs",
    name: "Grilled kebab platter",
    category: "grills",
    preference: "other",
    image: asset("Grilled Kebabs with Citrus Cabbage Salad"),
    description:
      "Grilled kebabs served over a colourful cabbage salad, finished with bright citrus.",
    note: "From the grill · Citrus finish",
    colour: "#e8ede3",
  },
  {
    id: "cauliflower-curry",
    name: "Golden cauliflower curry",
    category: "curries",
    preference: "vegetarian",
    image: asset("Golden Cauliflower Curry in Black Bowl(1)"),
    description:
      "Golden cauliflower in a richly coloured curry. A warming bowl for your next gathering around the table.",
    note: "Golden cauliflower · Rich curry",
    colour: "#f1ead0",
  },
  {
    id: "chilli-bowl",
    name: "Indo-Chinese stir-fry",
    category: "small-plates",
    preference: "other",
    image: asset("Glossy Red Indo-Chinese Stir-Fry Bowl"),
    description:
      "A glossy red stir-fry with peppers, herbs and spring onions. Bold colour, big appetite.",
    note: "Bold flavours · Spring onions",
    colour: "#f3e4de",
  },
  {
    id: "chicken-curry",
    name: "Garnished chicken curry",
    category: "curries",
    preference: "chicken",
    image: asset("Garnished Chicken Curry in Black Bowl(1)"),
    description:
      "A bowl of chicken curry finished with a generous garnish. Pair it with rice and share a little comfort.",
    note: "Chicken curry · Fresh garnish",
    colour: "#ebe4ed",
  },
  {
    id: "shrimp-rice",
    name: "Shrimp fried rice",
    category: "rice",
    preference: "seafood",
    image: asset("Black Bowl Shrimp Fried Rice(1)"),
    description:
      "Shrimp and colourful fried rice, brought together in one satisfying bowl.",
    note: "Shrimp · Colourful rice",
    colour: "#e1eae7",
  },
  {
    id: "mediterranean-salad",
    name: "Mediterranean salad bowl",
    category: "salads",
    preference: "vegetarian",
    image: asset("Vibrant Mediterranean Salad Boat Bowl(1)"),
    description:
      "A colourful Mediterranean-inspired salad bowl. A fresh-looking addition to the table.",
    note: "Bright colours · A fresh beginning",
    colour: "#e8eddb",
  },
  {
    id: "biryani",
    name: "Chicken biryani bowl",
    category: "rice",
    preference: "chicken",
    image: asset("Textured Black Bowl of Colorful Biryani"),
    description:
      "Golden rice and chicken in a textured black bowl, with herbs and cashews scattered over the top.",
    note: "Layered rice · Chicken & herbs",
    colour: "#f3e8d5",
  },
  {
    id: "chicken-salad",
    name: "Grilled chicken salad",
    category: "salads",
    preference: "chicken",
    image: asset("Grilled Chicken Cabbage Salad Bowl"),
    description:
      "Grilled chicken paired with a colourful cabbage salad. A little freshness alongside the warmth of the grill.",
    note: "Grilled chicken · Cabbage salad",
    colour: "#e4ebe2",
  },
  {
    id: "spicy-stir-fry",
    name: "Spicy chilli stir-fry",
    category: "small-plates",
    preference: "other",
    image: asset("Glossy Spicy Chili Stir-Fry Bowl(1)"),
    description:
      "A glossy chilli stir-fry with a vibrant finish. A bold little discovery for the table.",
    note: "Chilli-led · Made for sharing",
    colour: "#efe0da",
  },
  {
    id: "chicken-curry-bowl",
    name: "Chicken curry bowl",
    category: "curries",
    preference: "chicken",
    image: asset("Garnished Chicken Curry in Black Bowl(2)"),
    description:
      "Chicken curry served in a black bowl with a fresh garnish. Familiar flavours for a comfortable meal.",
    note: "Warming curry · Chicken",
    colour: "#e9e1d6",
  },
];
