import { createPageMetadata } from "@/lib/seo";
import { ContactExperience } from "./contact-experience";

export const metadata = createPageMetadata(
  "Contact",
  "Contact JOUKH for enquiries, restaurant information, and directions.",
  "/contact",
);

export default function ContactPage() {
  return <ContactExperience />;
}
