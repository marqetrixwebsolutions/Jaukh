import type { Metadata } from "next";
import { ContactExperience } from "./contact-experience";

export const metadata: Metadata = {
  title: "Contact — JOUKH Restaurant",
  description:
    "Get in touch with JOUKH. Find our sample contact details, send an inquiry, and explore our location.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
