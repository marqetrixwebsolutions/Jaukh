"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import styles from "./contact.module.css";

const sampleAddress = "12 Example Lane, Your City, India";
const mapSearch = encodeURIComponent(sampleAddress);

export function ContactExperience() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [formNotice, setFormNotice] = useState("");

  useEffect(() => {
    let previousY = window.scrollY;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY - previousY;
      previousY = currentY;

      if (idleTimer) clearTimeout(idleTimer);
      if (currentY <= 12) {
        setHeaderVisible(true);
        return;
      }

      if (direction > 2) setHeaderVisible(false);
      else if (direction < -2) setHeaderVisible(true);

      idleTimer = setTimeout(() => setHeaderVisible(false), 1800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormNotice(
      "This preview form is not connected, so your message has not been sent.",
    );
  };

  return (
    <main className={styles.contactPage}>
      <header
        className={`${styles.header}${headerVisible ? "" : ` ${styles.headerHidden}`}`}
      >
        <Link className={styles.brand} href="/" aria-label="Joukh home">
          <img
            src="/assests/joukh%20white%20logo.png"
            alt=""
            width={48}
            height={48}
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
          <Link href="/menu" onClick={() => setMobileNavOpen(false)}>
            The menu
          </Link>
          <Link href="/" onClick={() => setMobileNavOpen(false)}>
            The Experience
          </Link>
          <Link href="/contact" aria-current="page" onClick={() => setMobileNavOpen(false)}>
            Contact
          </Link>
        </nav>
        <a className={styles.headerCta} href="#contact-form">
          Say hello <ArrowUpRight size={16} />
        </a>
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

      <section className={styles.hero} aria-labelledby="contact-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <p className={styles.eyebrow}>WE’D LOVE TO HEAR FROM YOU</p>
        <h1 id="contact-title">
          Come as you are.
          <br />
          <em>Leave a little happier.</em>
        </h1>
        <p className={styles.heroCopy}>
          Questions, celebrations, or just saying hello — there’s always room at
          our table.
        </p>

      </section>

      <section className={styles.contactSection} id="contact-details">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>A NOTE, A CALL, A VISIT</p>
          <h2>Let’s make it a good one.</h2>
          <p>
            We’re here for the little questions and the big occasions. Reach out
            and we’ll take it from there.
          </p>
        </div>

        <div className={styles.contactGrid}>
          <form
            id="contact-form"
            className={styles.contactForm}
            onSubmit={handleSubmit}
          >
            <p className={styles.formEyebrow}>SEND US A NOTE</p>
            <div className={styles.fieldRow}>
              <label>
                Your name
                <input
                  autoComplete="name"
                  name="name"
                  placeholder="Name"
                  required
                />
              </label>
              <label>
                Email address
                <input
                  autoComplete="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>
            <label>
              What’s on your mind?
              <select name="reason" defaultValue="general">
                <option value="general">A general question</option>
                <option value="celebration">A special occasion</option>
                <option value="feedback">A little feedback</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label>
              Your message
              <textarea
                name="message"
                placeholder="Tell us a little more..."
                rows={5}
                required
              />
            </label>
            <button className={styles.submitButton} type="submit">
              Send your note <ArrowUpRight size={17} />
            </button>
            <p className={styles.formNote} role="status" aria-live="polite">
              {formNotice ||
                "Form preview only — messages are not sent yet. Sample contact details are shown."}
            </p>
          </form>

          <aside className={styles.detailsCard} aria-label="Contact details">
            <span className={styles.detailsNumber}>01 / COME ON IN</span>
            <h3>A place at our table.</h3>
            <p className={styles.sampleNotice}>
              Sample details — replace before publishing.
            </p>

            <div className={styles.detailItem}>
              <MapPin size={19} aria-hidden="true" />
              <div>
                <span>FIND US</span>
                <p>{sampleAddress}</p>
              </div>
            </div>
            <a className={styles.detailItem} href="tel:+910000000000">
              <Phone size={18} aria-hidden="true" />
              <div>
                <span>GIVE US A CALL</span>
                <p>+91 00000 00000</p>
              </div>
            </a>
            <a className={styles.detailItem} href="mailto:hello@example.com">
              <Mail size={18} aria-hidden="true" />
              <div>
                <span>DROP US A LINE</span>
                <p>hello@example.com</p>
              </div>
            </a>
            <div className={styles.detailItem}>
              <Clock3 size={18} aria-hidden="true" />
              <div>
                <span>WHEN WE’RE HERE</span>
                <p>Daily · 12:00 pm – 10:30 pm</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.mapSection} aria-labelledby="map-title">
        <div className={styles.mapHeading}>
          <div>
            <p className={styles.eyebrow}>THE LAST LITTLE DETAIL</p>
            <h2 id="map-title">A table is waiting.</h2>
          </div>
          <p>
            Find us at our sample location. We can’t wait to welcome you in.
          </p>
        </div>
        <div className={styles.mapFrame}>
          <iframe
            title="Map preview for the sample JOUKH address"
            src={`https://maps.google.com/maps?q=${mapSearch}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className={styles.mapLabel}>
            <MapPin size={18} />
            <span>
              JOUKH <small>MAP PREVIEW · SAMPLE ADDRESS</small>
            </span>
          </div>
          <a
            className={styles.mapLink}
            href={`https://www.google.com/maps/search/?api=1&query=${mapSearch}`}
            target="_blank"
            rel="noreferrer"
          >
            OPEN IN MAPS <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerBrand}>
          JOUKH <span>INDIAN RESTAURANT</span>
        </Link>
        <p>Good food. Warm hospitality. Always a place for you.</p>
        <Link href="/" className={styles.backLink}>
          BACK TO JOUKH <ArrowRight size={15} />
        </Link>
      </footer>
    </main>
  );
}
