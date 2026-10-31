import type { Metadata } from "next";
import { ContactExperience } from "./contact-experience";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact JOUKH for enquiries, restaurant information, and directions.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
