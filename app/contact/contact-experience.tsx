"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useReservation } from "@/components/reservations/reservation-provider";
import styles from "./contact.module.css";

const restaurantAddress =
  "Al Cheikh Hasan Ibn Hussein Ibn Ali, Al Hamra, Riyadh 13217, Saudi Arabia";
const restaurantMapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4334.333179364254!2d46.76672719999999!3d24.7898683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2effa9f50cd1c1%3A0xf66ca5db3a16a6e7!2sJoukh%20Indian%20Restaurant!5e1!3m2!1sen!2sin!4v1793617836770!5m2!1sen!2sin";

export function ContactExperience() {
  const { openReservation } = useReservation();
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
          {/* <Link href="/" onClick={() => setMobileNavOpen(false)}>
            The Experience
          </Link> */}
          <Link href="/contact" aria-current="page" onClick={() => setMobileNavOpen(false)}>
            Contact
          </Link>
        </nav>
        <button
          className={styles.headerCta}
          type="button"
          onClick={() => {
            setMobileNavOpen(false);
            openReservation();
          }}
        >
          RESERVE A TABLE <ArrowUpRight size={16} />
        </button>
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
          
          </form>

          <aside className={styles.detailsCard} aria-label="Contact details">
            <span className={styles.detailsNumber}>01 / COME ON IN</span>
            <h3>A place at our table.</h3>

            <a
              className={styles.detailItem}
              href={restaurantMapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={19} aria-hidden="true" />
              <div>
                <span>FIND US</span>
                <p>{restaurantAddress}</p>
              </div>
            </a>
            <a className={styles.detailItem} href="tel:+966556396430">
              <Phone size={18} aria-hidden="true" />
              <div>
                <span>GIVE US A CALL</span>
                <p>+966 55 639 6430</p>
              </div>
            </a>
            <a
  className={styles.detailItem}
  href="https://wa.me/966556396430"
  target="_blank"
  rel="noopener noreferrer"
>
  <MessageCircle size={18} aria-hidden="true" />
  <div>
    <span>WHATSAPP US</span>
    <p>+966 55 639 6430</p>
  </div>
</a>
            <div className={styles.detailItem}>
              <Clock3 size={18} aria-hidden="true" />
              <div>
                <span>WHEN WE’RE HERE</span>
                <p>Daily · 12:00 pm – 2:00 am</p>
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
            Find us in Al Hamra, Riyadh. We can’t wait to welcome you in.
          </p>
        </div>
        <div className={styles.mapFrame}>
          <iframe
            title="Map preview for JOUKH in Al Hamra, Riyadh"
            src={restaurantMapUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          
         
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrandBlock}>
            <Link className={styles.footerBrand} href="/" aria-label="Joukh home">
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
            <p>Indian roots. Open hearts.</p>
          </div>
          <div className={styles.footerLinks}>
            <span>COME ON IN</span>
            <Link href="/#story">Our story</Link>
            <Link href="/menu">Our menu</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.footerLinks}>
            <span>STAY A LITTLE</span>
            <Link href="/#experience">The experience</Link>
            <Link href="/#objectives">Our objectives</Link>
            <Link href="/contact#contact-form">Reservations</Link>
          </div>
          <div className={styles.footerNote}>
            <UtensilsCrossed size={25} aria-hidden="true" />
            <p>
              A taste beyond
              <br />
              the ordinary.
            </p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 JOUKH. ALL RIGHTS RESERVED.</span>
          <span>MADE WITH WARMTH & A LITTLE SPICE.</span>
          <Link href="/#home">BACK TO TOP ↗</Link>
        </div>
      </footer>
    </main>
  );
}
