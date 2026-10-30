"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { FloatingFoodHero } from "@/components/ui/hero-section-7";
import { CircularGallery } from "@/components/ui/circular-gallery-2";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  X,
  Menu,
  Leaf,
  Heart,
  Sun,
  UtensilsCrossed,
} from "lucide-react";

const storyGalleryItems = [
  {
    image: "/assests/Vibrant%20Chicken%20Biryani%20Bowl%20with%20Cashews.png",
    text: "Chicken biryani with cashews",
  },
  {
    image: "/assests/Garnished%20Chicken%20Curry%20in%20Black%20Bowl%281%29.png",
    text: "Slow-cooked chicken curry",
  },
  {
    image: "/assests/Glossy%20Red%20Indo-Chinese%20Stir-Fry%20Bowl.png",
    text: "Indo-Chinese stir-fry",
  },
  {
    image: "/assests/Golden%20Cauliflower%20Curry%20in%20Black%20Bowl%281%29.png",
    text: "Golden cauliflower curry",
  },
  {
    image: "/assests/Grilled%20Chicken%20Cabbage%20Salad%20Bowl.png",
    text: "Grilled chicken and fresh cabbage",
  },
  {
    image: "/assests/Grilled%20Kebabs%20with%20Citrus%20Cabbage%20Salad.png",
    text: "Grilled kebabs with citrus salad",
  },
  {
    image: "/assests/Textured%20Black%20Bowl%20of%20Colorful%20Biryani.png",
    text: "Colourful chicken biryani",
  },
  {
    image: "/assests/Glossy%20Spicy%20Chili%20Stir-Fry%20Bowl%281%29.png",
    text: "Spicy chili stir-fry with peppers and spring onions",
  },
];

const categories = [
  {
    name: "Curries",
    note: "Rich, slow & soulful",
    image: "curry",
    dishes: ["Butter chicken", "Palak paneer", "Dal makhani"],
  },
  {
    name: "From the tandoor",
    note: "Fire-kissed favourites",
    image: "tandoor",
    dishes: ["Chicken tikka", "Paneer tikka", "Tandoori roti"],
  },
  {
    name: "Biryanis",
    note: "Layers of a little magic",
    image: "biryani",
    dishes: ["Chicken dum biryani", "Vegetable biryani", "Fragrant jeera rice"],
  },
  {
    name: "Small plates",
    note: "A delicious beginning",
    image: "tandoor",
    dishes: ["Vegetable samosas", "Onion bhaji", "Aloo tikki"],
  },
];

const plateImages = [
  // {
  //   src: "/assests/Garnished%20Chicken%20Curry%20in%20Black%20Bowl%281%29.png",
  //   name: "Garnished Chicken Curry",
  //   alt: "Garnished chicken curry served in a black bowl",
  // },
  {
    src: "/assests/Garnished%20Chicken%20Curry%20in%20Black%20Bowl%282%29.png",
    name: "Chicken Curry with Ginger",
    alt: "Chicken curry topped with fresh ginger",
  },
  {
    src: "/assests/Glossy%20Red%20Indo-Chinese%20Stir-Fry%20Bowl.png",
    name: "Indo-Chinese Stir-Fry",
    alt: "Glossy red Indo-Chinese stir-fry with peppers",
  },
  {
    src: "/assests/Golden%20Cauliflower%20Curry%20in%20Black%20Bowl%281%29.png",
    name: "Golden Cauliflower Curry",
    alt: "Golden cauliflower curry in a black bowl",
  },
  {
    src: "/assests/Grilled%20Chicken%20Cabbage%20Salad%20Bowl.png",
    name: "Grilled Chicken Salad",
    alt: "Grilled chicken and fresh cabbage salad",
  },
  {
    src: "/assests/Grilled%20Kebabs%20with%20Citrus%20Cabbage%20Salad.png",
    name: "Grilled Kebabs",
    alt: "Grilled kebabs with citrus and cabbage salad",
  },
  {
    src: "/assests/Glossy%20Spicy%20Chili%20Stir-Fry%20Bowl%281%29.png",
    name: "Spicy Chili Stir-Fry",
    alt: "Spicy chili stir-fry with peppers and spring onions in a black bowl",
  },
];

function Brand() {
  return (
    <a href="#home" className="brand" aria-label="Joukh home">
      <img
        className="brand-emblem"
        src="/assests/Deep%20Purple%20Chef%20Emblem.png"
        alt=""
        width={48}
        height={48}
      />
      <span className="brand-wordmark">
        JOUKH<small>INDIAN RESTAURANT</small>
      </span>
    </a>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [mobile, setMobile] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [activeDish, setActiveDish] = useState(0);
  const [reservation, setReservation] = useState(false);
  const [saved, setSaved] = useState(false);
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
    );
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) video.current?.pause();
    const lenis = reduce
      ? null
      : new Lenis({ duration: 1.15, anchors: { offset: -85 } });
    lenis?.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    const mm = gsap.matchMedia();
    const setupDishCarousel = () => {
      const cards = gsap.utils.toArray<HTMLElement>(".dish-card");
      if (cards.length < 2) return;
      const lastCard = cards[cards.length - 1];
      const carouselEnd = () =>
        `+=${window.innerHeight * (cards.length - 1)}`;

      gsap.to(".dish-track", {
        x: () =>
          window.innerWidth / 2 -
          (lastCard.offsetLeft + lastCard.offsetWidth / 2),
        ease: "none",
        scrollTrigger: {
          trigger: ".plate-section",
          start: "top top",
          end: carouselEnd,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (trigger) =>
            setActiveDish(
              Number.isFinite(trigger.progress)
                ? Math.max(
                    0,
                    Math.min(
                      plateImages.length - 1,
                      Math.round(trigger.progress * (cards.length - 1)),
                    ),
                  )
                : 0,
            ),
        },
      });
      gsap.to(cards, {
        duration: 1,
        rotation: 12,
        stagger: { amount: cards.length - 1 },
        ease: "none",
        scrollTrigger: {
          trigger: ".plate-section",
          start: "top top",
          end: carouselEnd,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    };
    const film = video.current;
    const filmObserver = new IntersectionObserver(
      ([entry]) => {
        if (!film) return;
        if (entry.isIntersecting && !reduce) {
          void film.play().catch(() => setPlaying(false));
        } else {
          film.pause();
        }
      },
      { threshold: 0.15 },
    );
    if (film) filmObserver.observe(film);
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".loader", { display: "none" });
        return;
      }
      const heroLogo =
        root.current?.querySelector<HTMLElement>(".hero-logo-slot");
      const headerLogo = root.current?.querySelector<HTMLElement>(
        ".header .brand-emblem",
      );
      const heroSection =
        root.current?.querySelector<HTMLElement>("#home");
      const travellingLogo =
        root.current?.querySelector<HTMLElement>(".travelling-logo");
      const heroEmblem =
        root.current?.querySelector<HTMLElement>(".hero-center-emblem");
      if (heroLogo && headerLogo && heroSection && travellingLogo && heroEmblem) {
        gsap.set(headerLogo, { autoAlpha: 0 });
        gsap.set(travellingLogo, { visibility: "visible" });
        const logoTransfer = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: () => `+=${Math.min(window.innerHeight * 0.65, 650)}`,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        logoTransfer
          .fromTo(
            travellingLogo,
            {
              left: () => heroLogo.getBoundingClientRect().left,
              top: () =>
                heroLogo.getBoundingClientRect().top -
                heroSection.getBoundingClientRect().top,
              width: () => heroLogo.offsetWidth,
              height: () => heroLogo.offsetHeight,
              autoAlpha: 0,
            },
            {
              left: () => headerLogo.getBoundingClientRect().left,
              top: () => headerLogo.getBoundingClientRect().top,
              width: () => headerLogo.offsetWidth,
              height: () => headerLogo.offsetHeight,
              duration: 0.92,
              ease: "none",
            },
          )
          .to(heroEmblem, { autoAlpha: 0, duration: 0.08 }, 0.04)
          .to(travellingLogo, { autoAlpha: 1, duration: 0.08 }, 0.04)
          .to(headerLogo, { autoAlpha: 1, duration: 0.12 }, 0.84)
          .to(travellingLogo, { autoAlpha: 0, duration: 0.08 }, 0.92);

        gsap.to(".floating-image-position", {
          xPercent: (_index: number, element: HTMLElement) =>
            element.dataset.entrance === "left"
              ? -155
              : element.dataset.entrance === "right"
                ? 155
                : 0,
          yPercent: (_index: number, element: HTMLElement) =>
            element.dataset.entrance === "top"
              ? -155
              : element.dataset.entrance === "bottom"
                ? 155
                : 0,
          scale: 0.55,
          autoAlpha: 0,
          ease: "none",
          stagger: 0.025,
          immediateRender: false,
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: () => `+=${Math.min(window.innerHeight * 0.55, 500)}`,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
      }
      gsap
        .timeline()
        .call(() => lenis?.stop())
        .from(".loader-brand", { y: 40, opacity: 0, duration: 0.65 })
        .to(".loader-line span", { scaleX: 1, duration: 0.8 }, "<.15")
        .to(".loader", {
          yPercent: -100,
          duration: 0.95,
          ease: "power4.inOut",
          delay: 0.15,
        })
        .set(".loader", { display: "none" })
        .call(() => lenis?.start())
        .addLabel("hero-ready")
        .from(
          ".hero-reveal",
          {
            y: 38,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
          },
          "hero-ready",
        )
        .from(
          ".floating-image-position",
          {
            x: (_index: number, element: HTMLElement) =>
              element.dataset.entrance === "left"
                ? -window.innerWidth
                : element.dataset.entrance === "right"
                  ? window.innerWidth
                  : 0,
            y: (_index: number, element: HTMLElement) =>
              element.dataset.entrance === "top"
                ? -window.innerHeight
                : element.dataset.entrance === "bottom"
                  ? window.innerHeight
                  : 0,
            scale: 0.55,
            autoAlpha: 0,
            duration: 1.35,
            stagger: 0.1,
            ease: "power3.out",
          },
          "hero-ready+=.12",
        );
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".film-section",
            start: "top 92%",
            end: "top 10%",
            scrub: 1,
          },
        })
        .fromTo(
          ".film-frame",
          { width: "68%", y: 140, autoAlpha: 0 },
          {
            width: "68%",
            y: 0,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power1.out",
          },
        )
        .to(".film-frame", { width: "100%", duration: 0.6, ease: "none" });
      gsap.from(".story-copy", {
        x: 65,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".story-copy", start: "top 88%", once: true },
      });
      const storySplit = SplitText.create(".story-text", { type: "words" });
      gsap.set(storySplit.words, { opacity: 0.15, y: 12 });
      gsap.to(storySplit.words, {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: "#story",
          start: "top top",
          end: () => `+=${Math.max(1100, window.innerHeight * 1.65)}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      [".text"].forEach((selector) => {
        if (!root.current?.querySelector(selector)) return;
        const split = SplitText.create(selector, { type: "words" });
        gsap.from(split.words, {
          opacity: selector === ".text" ? 0 : 0.15,
          y: 15,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: selector,
            start: "top 85%",
            ...(selector === ".story-text"
              ? { end: "bottom 45%", scrub: 1 }
              : { once: true }),
          },
        });
      });
      gsap.utils
        .toArray<HTMLElement>(".dining-showcase .showcase-row")
        .forEach((el) =>
          gsap.fromTo(
            el,
            {
              x: el.classList.contains("showcase-row-reverse") ? 80 : -80,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 65%",
                scrub: true,
              },
            },
          ),
        );
      gsap.utils
        .toArray<HTMLElement>(".reveal:not(.showcase-row)")
        .forEach((el) =>
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
      mm.add("(min-width: 768px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".ingredients-section",
              start: "top top",
              end: "+=1300",
              pin: true,
              scrub: 1,
            },
          })
          .fromTo(
            ".ingredient-top",
            { y: 235, scale: 0.6, opacity: 0 },
            { y: 0, scale: 1, opacity: 1 },
            0,
          )
          .fromTo(
            ".ingredient-middle",
            { y: 160, scale: 0.7, opacity: 0 },
            { y: 0, scale: 1, opacity: 1 },
            0,
          )
          .fromTo(
            ".ingredient-lower",
            { y: 85, scale: 0.8, opacity: 0 },
            { y: 0, scale: 1, opacity: 1 },
            0,
          )
          .from(
            ".ingredient-label",
            { opacity: 0, y: 18, stagger: 0.15 },
            0.25,
          );
        setupDishCarousel();
      });
      mm.add("(max-width: 767px)", () => {
        gsap.from(".bowl-art", {
          y: 60,
          opacity: 0,
          scrollTrigger: { trigger: ".bowl-art", start: "top 85%" },
        });
        gsap.fromTo(
          ".ingredient-top",
          { y: 160, scale: 0.65, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: ".bowl-stage",
              start: "top 85%",
              end: "top 20%",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".ingredient-middle",
          { y: 100, scale: 0.75, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: ".bowl-stage",
              start: "top 85%",
              end: "top 20%",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".ingredient-lower",
          { y: 50, scale: 0.8, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: ".bowl-stage",
              start: "top 85%",
              end: "top 20%",
              scrub: 1,
            },
          },
        );
        setupDishCarousel();
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      mm.revert();
      filmObserver.disconnect();
      film?.pause();
      ctx.revert();
      lenis?.destroy();
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
    };
  }, []);
  useEffect(() => {
    if (reservation || selected !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [reservation, selected]);
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
  const close = () => {
    setReservation(false);
    setSelected(null);
    setSaved(false);
  };
  const reserve = () => {
    setSaved(false);
    setReservation(true);
  };

  return (
    <div ref={root} className="site-shell">

      <img
        className="travelling-logo"
        src="/assests/Deep%20Purple%20Chef%20Emblem.png"
        alt=""
        aria-hidden="true"
        width={176}
        height={176}
      />
      <div className="loader" aria-hidden="true">
        <div className="loader-brand">
          <div className="loader-emblem">
            <img
              src="/assests/Deep%20Purple%20Chef%20Emblem.png"
              alt=""
              width={84}
              height={84}
            />
          </div>
          JOUKH<span>A TASTE BEYOND ORDINARY</span>
        </div>
        <div className="loader-line">
          <span />
        </div>
        <p>Good things take a little time.</p>
      </div>
      {/* <a className="skip-link" href="#main">
        Skip to content
      </a> */}
      <header className={`header${headerVisible ? "" : " header-hidden"}`}>
        <Brand />
        <nav
          aria-label="Main navigation"
          className={mobile ? "nav nav-open" : "nav"}
        >
          {[
            ["Home", "home"],
            ["Our story", "story"],
            ["The menu", "menu"],
            ["The experience", "experience"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMobile(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button className="button button-small" onClick={reserve}>
          Reserve a table <ArrowUpRight size={15} />
        </button>
        <button
          className="mobile-toggle"
          aria-label={mobile ? "Close navigation" : "Open navigation"}
          aria-expanded={mobile}
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <FloatingFoodHero
          id="home"
          variant="editorial"
          title={
            <>
              <span className="hero-name">JOUKH</span>{" "}
              <span className="hero-restaurant">INDIAN RESTAURANT</span>
            </>
          }
          logoSrc="/assests/Deep%20Purple%20Chef%20Emblem.png"
          description={
            "Good food, warm hospitality, and a place worth coming back to.\nServing our guests since November 2023."
          }
          images={[
            {
              src: "/assests/Vibrant%20Chicken%20Biryani%20Bowl%20with%20Cashews.png",
              alt: "Chicken biryani in a black bowl with cashews",
              className: "hero-dish hero-dish-curry",
              entrance: "left",
            },
            {
              src: "/assests/Grilled%20Kebabs%20with%20Citrus%20Cabbage%20Salad.png",
              alt: "Grilled kebabs with citrus and cabbage salad",
              className: "hero-dish hero-dish-tandoor",
              entrance: "right",
            },
            {
              src: "/assests/Textured%20Black%20Bowl%20of%20Colorful%20Biryani.png",
              alt: "Colourful chicken biryani in a textured black bowl",
              className: "hero-dish hero-dish-biryani",
              entrance: "bottom",
            },
            {
              src: "/images/hero-leaf.png",
              alt: "Fresh basil",
              className: "hero-garnish hero-leaf",
              entrance: "top",
            },
            {
              src: "/assests/Glossy%20Red%20Indo-Chinese%20Stir-Fry%20Bowl.png",
              alt: "Red Indo-Chinese stir-fry with peppers and spring onions",
              className: "hero-dish hero-dish-stir-fry",
              entrance: "left",
            },
            {
              src: "/images/hero-leaf.png",
              alt: "Fresh basil",
              className: "hero-garnish hero-leaf-small",
              entrance: "bottom",
            },
            {
              src: "/assests/Grilled%20Kebabs%20with%20Citrus%20Cabbage%20Salad.png",
              alt: "A plate of grilled kebabs",
              className: "hero-dish hero-dish-extra-left",
              entrance: "left",
            },
            {
              src: "/assests/Glossy%20Red%20Indo-Chinese%20Stir-Fry%20Bowl.png",
              alt: "Freshly prepared Indo-Chinese stir-fry",
              className: "hero-dish hero-dish-extra-right",
              entrance: "right",
            },
            {
              src: "/assests/Vibrant%20Chicken%20Biryani%20Bowl%20with%20Cashews.png",
              alt: "A bowl of biryani finished with cashews",
              className: "hero-dish hero-dish-extra-top",
              entrance: "top",
            },
          ]}
        >
          {/* <div className="hero-actions hero-reveal">
            <a className="button" href="#menu">
              Explore our menu <ArrowUpRight size={16} />
            </a>
            <button className="text-link" onClick={reserve}>
              Make yourself at home <ArrowRight size={17} />
            </button>
          </div> */}
        </FloatingFoodHero>
        <section
          className="film-section"
          id="film"
          aria-label="A glimpse of our kitchen"
        >
          <div className="film-frame">
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              poster="/images/hero.jpg"
              onLoadedData={() => {
                if (
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ) {
                  video.current?.pause();
                  setPlaying(false);
                }
              }}
              onError={() => setPlaying(false)}
            >
              <source src="/images/kitchen.mp4" type="video/mp4" />
            </video>
            <div className="film-shade" />
            <div className="film-top">
              <span>AN INVITATION TO SLOW DOWN</span>
              <span>01 / THE EXPERIENCE</span>
            </div>
            <div className="film-caption">
              <p>
                A little spice.
                <br />
                <em>A lot of soul.</em>
              </p>
              <button
                className="film-control"
                aria-label={
                  playing ? "Pause kitchen film" : "Play kitchen film"
                }
                onClick={async () => {
                  if (!video.current) return;
                  if (video.current.paused) {
                    try {
                      await video.current.play();
                      setPlaying(true);
                    } catch {
                      setPlaying(false);
                    }
                  } else {
                    video.current.pause();
                    setPlaying(false);
                  }
                }}
              >
                {playing ? <Pause size={19} /> : <Play size={19} />}
              </button>
            </div>
          </div>
        </section>
        <section className="story" id="story">
          <CircularGallery
            className="story-gallery"
            pinTarget="#story"
            items={storyGalleryItems}
            bend={5}
            borderRadius={0.07}
            role="region"
            aria-label="A glimpse of food and gatherings at Joukh"
          />
          <div className="story-copy">
            <div className="eyebrow">A WARM WELCOME TO JOUKH</div>
            <p className="story-text">
              At Joukh, every meal is prepared with care and served with a
              welcome that makes you feel at home. Since opening our doors on 2
              November 2023, we have been bringing friends and families together
              around Indian curries, tandoori favourites and biryanis, made
              fresh and served with pride.
            </p>
          </div>
        </section>
        <section
          className="dining-showcase section-wrap"
          aria-label="Our menu and dining space"
        >
          <article className="showcase-row reveal">
            <div className="showcase-copy showcase-menu">
              <div className="eyebrow">OUR MENU</div>
              <h2>
                Our Vision Is to Bring
                <br />
                Indian Flavours to the World
              </h2>
              <p>
                To be a beloved and trusted dining destination, known for
                outstanding food, genuine hospitality and an experience guests
                want to share with others.
              </p>
              <a href="#menu" className="showcase-link">
                BROWSE MENU <ArrowRight size={19} />
              </a>
            </div>
            <div className="showcase-photo">
              <img
                src="/images/curry.jpg"
                alt="Creamy Indian curry finished with herbs and a swirl of cream"
                loading="lazy"
              />
            </div>
          </article>
          <article className="showcase-row showcase-row-reverse reveal">
            <div className="showcase-photo">
              <img
                src="/images/interior.jpg"
                alt="An inviting restaurant dining room for shared meals and celebrations"
                loading="lazy"
              />
            </div>
            <div className="showcase-copy showcase-place">
              <div className="eyebrow">A PLACE TO BELONG</div>
              <h2>
                Bringing People Together
                <br />
                Creating Lasting Memories
              </h2>
              <p>
                To serve fresh, flavorful food made with quality ingredients, in
                a clean and welcoming environment, with friendly and attentive
                service, so that every guest leaves happy and every visit builds
                a lasting relationship
              </p>
              <button onClick={reserve} className="showcase-link">
                VISIT US <ArrowRight size={19} />
              </button>
            </div>
          </article>
        </section>
        <section className="ingredients-section" id="ingredients">
          <div className="ingredients-heading">
            <div className="eyebrow">EVERY LAYER HAS A STORY</div>
            <h2>
              Nothing ordinary.
              <br />
              <em>Not a single grain.</em>
            </h2>
          </div>
          <div className="bowl-stage">
            <div
              className="bowl-art"
              role="img"
              aria-label="Exploded biryani bowl with fresh herbs, spiced chicken and saffron rice"
            >
              <div className="ingredient-slice ingredient-top" />
              <div className="ingredient-slice ingredient-middle" />
              <div className="ingredient-slice ingredient-lower" />
              <div className="ingredient-slice ingredient-bowl" />
            </div>
            <div className="ingredient-label label-herbs">
              <span>01 / THE FINISHING TOUCH</span>
              <h3>Fresh from nature.</h3>
              <p>
                Fragrant mint, whole spices
                <br />
                and a little saffron magic.
              </p>
            </div>
            <div className="ingredient-label label-heart">
              <span>02 / THE HEART</span>
              <h3>Time. Care. Flavour.</h3>
              <p>
                Richly spiced and slow-cooked.
                <br />
                Always worth the wait.
              </p>
            </div>
            <div className="ingredient-label label-rice">
              <span>03 / THE FOUNDATION</span>
              <h3>Every grain matters.</h3>
              <p>
                Fluffy basmati, layered with
                <br />
                warmth and tradition.
              </p>
            </div>
          </div>
          <div className="ingredients-foot">
            <span>HONEST INGREDIENTS. EXTRAORDINARY FLAVOUR.</span>
            <span>KEEP SCROLLING ↓</span>
          </div>
        </section>
        {/* <section className="highlights section-wrap" id="experience">
          <div className="highlights-heading reveal">
            <div className="eyebrow">HIGHLIGHTS</div>
            <h2>
              The Joukh
              <br />
              <em>experience.</em>
            </h2>
            <p>
              Come for the flavours.
              <br />
              Stay for how it feels.
            </p>
          </div>
          <div className="highlight-grid">
            {[
              {
                icon: <Leaf />,
                title: "Fresh, quality ingredients",
                text: "Every dish starts with carefully selected ingredients and is prepared fresh.",
              },
              {
                icon: <Sun />,
                title: "Welcoming atmosphere",
                text: "A comfortable setting for family meals, gatherings with friends, and quick bites alike.",
              },
              {
                icon: <Heart />,
                title: "Service that cares",
                text: "Our team is here to make every visit smooth, friendly and memorable.",
              },
            ].map((item, i) => (
              <article className="highlight reveal" key={item.title}>
                <div className="highlight-top">
                  {item.icon}
                  <span>0{i + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <nav
            className="highlight-actions reveal"
            aria-label="Highlights actions"
          >
            <a className="button" href="#menu">
              View Our Menu <ArrowUpRight size={16} />
            </a>
            <button className="button button-outline" onClick={reserve}>
              Visit Us <ArrowRight size={16} />
            </button>
            <a
              className="button button-outline highlight-tiktok"
              href="https://www.tiktok.com/@joukh.sa"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow Us on TikTok (@joukh.sa) <ArrowUpRight size={16} />
            </a>
          </nav>
        </section> */}
        <section className="plate-section">
          <div className="eyebrow">FROM OUR KITCHEN, WITH LOVE</div>
          <div
            className="dish-gallery"
            role="region"
            aria-label="Featured dishes"
            tabIndex={0}
          >
            <div className="dish-track">
              {plateImages.map((dish, index) => (
                <article
                  className={`dish-card${activeDish === index ? " is-active" : ""}`}
                  key={dish.src}
                >
                  <div className="dish-rim">
                    <img src={dish.src} alt={dish.alt} />
                  </div>
                </article>
              ))}
            </div>
          </div>
          <h2 className="dish-active-name" aria-live="polite">
            {(plateImages[activeDish] ?? plateImages[0]).name}
          </h2>
          <div className="plate-bottom">
            <p>
              A little familiar. A little unexpected.
              <br />
              Always unmistakably JOUKH.
            </p>
            <a href="#menu" className="text-link">
              Find your favourite <ArrowRight size={18} />
            </a>
          </div>
        </section>
        {/* <section className="vision section-wrap" id="vision">
          <div className="vision-image reveal">
            <img
              src="/images/interior.jpg"
              alt="Warm restaurant dining space with inviting tables and soft lighting"
              loading="lazy"
            />
            <span>A PLACE TO BELONG</span>
          </div>
          <div className="vision-copy">
            <article className="reveal">
              <div className="eyebrow">01 / OUR VISION</div>
              <h2>
                More connection.
                <br />
                <em>One table at a time.</em>
              </h2>
              <p>
                To be a place where the richness of Indian cuisine brings people
                together, and every shared meal becomes a memory.
              </p>
            </article>
            <article className="mission reveal">
              <div className="eyebrow">02 / OUR MISSION</div>
              <h3>
                Tradition at heart.
                <br />
                Hospitality in every detail.
              </h3>
              <p>
                To serve thoughtfully prepared Indian food with warmth and care.
                To honour our roots, welcome everyone, and make the everyday
                feel a little more special.
              </p>
            </article>
          </div>
        </section> */}
        <section className="menu-section section-wrap" id="menu">
          <div className="menu-heading reveal">
            <div>
              <div className="eyebrow">EXPLORE OUR CUISINE</div>
              <h2>Something for Every Taste</h2>
            </div>
            <p>
              From flavourful curries to sizzling grills, discover our most
              loved categories.
            </p>
          </div>
          <div className="menu-grid">
            {categories.map((item, i) => (
              <button
                className="menu-card reveal"
                key={item.name}
                onClick={() => setSelected(i)}
              >
                <div className="menu-image">
                  <img
                    src={`/images/${item.image}.jpg`}
                    alt={item.name}
                    loading="lazy"
                  />
                  <span>0{i + 1}</span>
                </div>
                <div className="menu-info">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>
                  </div>
                  <ArrowUpRight size={21} />
                </div>
              </button>
            ))}
          </div>
          <p className="menu-note">
            A taste of what’s to come. Explore a category for a sample of our
            dishes.
          </p>
        </section>
        {/* <section className="reservation-section">
          <span className="reservation-flower">✳</span>
          <div className="eyebrow reveal">THERE’S A PLACE FOR YOU HERE</div>
          <h2 className="reveal">
            Good food brings
            <br />
            <em>people together.</em>
          </h2>
          <p className="reveal">Make a little room for a memorable meal.</p>
          <button className="button button-light reveal" onClick={reserve}>
            Reserve your table <ArrowUpRight size={17} />
          </button>
          <span className="reservation-detail">
            FAMILY DINNERS · LONG CONVERSATIONS · JUST BECAUSE
          </span>
        </section> */}
      </main>
      <footer className="footer section-wrap">
        <div className="footer-top">
          <div>
            <Brand />
            <p>Indian roots. Open hearts.</p>
          </div>
          <div className="footer-links">
            <span>COME ON IN</span>
            <a href="#home">Home</a>
            <a href="#story">Our story</a>
            <a href="#menu">Our menu</a>
          </div>
          <div className="footer-links">
            <span>STAY A LITTLE</span>
            <a href="#experience">The experience</a>
            <a href="#vision">Our vision</a>
            <button onClick={reserve}>
              Reservations <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="footer-note">
            <UtensilsCrossed size={25} />
            <p>
              A taste beyond
              <br />
              the ordinary.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 JOUKH. ALL RIGHTS RESERVED.</span>
          <span>MADE WITH WARMTH & A LITTLE SPICE.</span>
          <a href="#home">BACK TO TOP ↗</a>
        </div>
      </footer>
      <dialog
        data-lenis-prevent
        ref={dialog}
        className="detail-dialog"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-label={selected !== null ? "Menu preview" : "Plan your visit"}
      >
        <button
          className="dialog-close"
          aria-label="Close dialog"
          onClick={close}
        >
          <X />
        </button>
        {selected !== null ? (
          <>
            <div className="eyebrow">A TASTE OF THE MENU</div>
            <h2>{categories[selected].name}</h2>
            <img
              className="dialog-image"
              src={`/images/${categories[selected].image}.jpg`}
              alt={categories[selected].name}
            />
            <p className="dialog-intro">{categories[selected].note}</p>
            <ul className="dish-list">
              {categories[selected].dishes.map((dish) => (
                <li key={dish}>
                  {dish}
                  <span>↗</span>
                </li>
              ))}
            </ul>
            <p className="form-note">
              Illustrative menu. Selection and availability will be confirmed by
              the restaurant.
            </p>
            <button
              className="button"
              onClick={() => {
                setSelected(null);
                reserve();
              }}
            >
              Plan a visit <ArrowUpRight size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="eyebrow">MAKE YOURSELF AT HOME</div>
            <h2>
              A table for
              <br />
              <em>something special.</em>
            </h2>
            {saved ? (
              <div className="request-message" role="status">
                <Heart />
                <h3>Your visit is planned.</h3>
                <p>
                  Your details have been saved on this device. This is a
                  preview; a restaurant booking has not been made.
                </p>
                <button className="button" onClick={close}>
                  Lovely, thank you <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem(
                    "joukh-visit",
                    JSON.stringify(
                      Object.fromEntries(new FormData(e.currentTarget)),
                    ),
                  );
                  setSaved(true);
                }}
              >
                <p className="form-note">
                  Plan your visit below. This preview saves your details on this
                  device and does not send a reservation.
                </p>
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    placeholder="Name for the table"
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <div className="form-row">
                  <label>
                    Date
                    <input name="date" type="date" min={today} required />
                  </label>
                  <label>
                    Time
                    <select name="time">
                      {[
                        "12:00",
                        "13:00",
                        "14:00",
                        "18:00",
                        "19:00",
                        "20:00",
                        "21:00",
                      ].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Guests
                  <select name="guests" defaultValue="2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option value={n} key={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="button" type="submit">
                  Save my visit <ArrowUpRight size={16} />
                </button>
              </form>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
