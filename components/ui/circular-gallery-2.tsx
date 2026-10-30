"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  image: string;
  text: string;
}
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  bend?: number;
  borderRadius?: number;
  scrollEase?: number;
  pinTarget?: string;
}

// Adapted from the supplied CircularGallery: the same curved OGL planes and
// rounded image shader, driven by page scroll instead of wheel/drag handlers.
export function CircularGallery({
  items,
  bend = 3,
  borderRadius = 0.07,
  scrollEase = 0.08,
  pinTarget,
  className,
  ...props
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvasHost = canvasRef.current;
    if (!container || !canvasHost || !items.length) return;
    gsap.registerPlugin(ScrollTrigger);
    let dispose = () => {};
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      let renderer: Renderer;
      try {
        renderer = new Renderer({
          alpha: true,
          antialias: true,
          dpr: Math.min(devicePixelRatio, 1.5),
        });
      } catch {
        container.dataset.renderer = "fallback";
        return;
      }
      const gl = renderer.gl;
      if (!gl) return;
      gl.clearColor(0, 0, 0, 0);
      gl.canvas.setAttribute("aria-hidden", "true");
      canvasHost.appendChild(gl.canvas);
      const camera = new Camera(gl, { fov: 45 });
      camera.position.z = 20;
      const scene = new Transform();
      const geometry = new Plane(gl, { widthSegments: 24, heightSegments: 16 });
      let alive = true;
      let dirty = true;
      let visible = false;
      let target = 0;
      let current = 0;
      let viewport = { width: 1, height: 1 };
      let pixels = { width: 1, height: 1 };
      const media = items.map((item) => {
        const texture = new Texture(gl, { generateMipmaps: false });
        const uniforms = {
          tMap: { value: texture },
          uImageSizes: { value: [1, 1] },
          uPlaneSizes: { value: [1, 1] },
          uBorderRadius: { value: borderRadius },
          uOpacity: { value: 0 },
          uSpeed: { value: 0 },
        };
        const program = new Program(gl, {
          depthTest: false,
          depthWrite: false,
          transparent: true,
          cullFace: false,
          vertex: `
            precision highp float;
            attribute vec3 position;
            attribute vec2 uv;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform float uSpeed;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vec3 p = position;
              p.z += sin(p.x * 4.0 + p.y * 2.0) * uSpeed * 2.0;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }`,
          fragment: `
            precision highp float;
            uniform sampler2D tMap;
            uniform vec2 uImageSizes;
            uniform vec2 uPlaneSizes;
            uniform float uBorderRadius;
            uniform float uOpacity;
            varying vec2 vUv;
            float roundedBoxSDF(vec2 p, vec2 b, float r) {
              vec2 d = abs(p) - b;
              return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
            }
            void main() {
              float planeAspect = uPlaneSizes.x / uPlaneSizes.y;
              float imageAspect = uImageSizes.x / uImageSizes.y;
              vec2 imageScale = imageAspect > planeAspect
                ? vec2(1.0, planeAspect / imageAspect)
                : vec2(imageAspect / planeAspect, 1.0);
              vec2 imageOffset = (1.0 - imageScale) * 0.5;
              vec2 uv = (vUv - imageOffset) / imageScale;
              vec4 color = texture2D(tMap, uv);
              float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
              float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
              float insideImage = step(imageOffset.x, vUv.x) * step(vUv.x, imageOffset.x + imageScale.x)
                * step(imageOffset.y, vUv.y) * step(vUv.y, imageOffset.y + imageScale.y);
              gl_FragColor = vec4(color.rgb, color.a * alpha * insideImage * uOpacity);
            }`,
          uniforms,
        });
        const mesh = new Mesh(gl, { geometry, program });
        mesh.setParent(scene);
        const image = new Image();
        image.onload = () => {
          if (!alive) return;
          texture.image = image;
          uniforms.uImageSizes.value = [
            image.naturalWidth,
            image.naturalHeight,
          ];
          dirty = true;
        };
        image.src = item.image;
        return { mesh, texture, program, uniforms, image };
      });

      const resize = () => {
        pixels = {
          width: container.clientWidth,
          height: container.clientHeight,
        };
        renderer.setSize(pixels.width, pixels.height);
        camera.orthographic({
          left: -pixels.width / 2,
          right: pixels.width / 2,
          top: pixels.height / 2,
          bottom: -pixels.height / 2,
          near: 0.1,
          far: 100,
        });
        viewport = { width: pixels.width, height: pixels.height };
        const sidePadding = Math.max(18, pixels.width * 0.045);
        const cardWidth = Math.min(
          215,
          Math.max(
            pixels.width < 600 ? 88 : 0,
            (pixels.width - sidePadding * 2) / (items.length * 1.05),
          ),
          pixels.height * 0.46,
        );
        for (const item of media) {
          item.mesh.scale.set(
            (cardWidth / pixels.width) * viewport.width,
            ((cardWidth * 1.3) / pixels.height) * viewport.height,
            1,
          );
          item.uniforms.uPlaneSizes.value = [
            item.mesh.scale.x,
            item.mesh.scale.y,
          ];
        }
        dirty = true;
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        dirty = true;
      });
      intersection.observe(container);

      const pinnedSection = pinTarget
        ? (container.closest<HTMLElement>(pinTarget) ?? container)
        : container;
      const trigger = ScrollTrigger.create({
        trigger: pinnedSection,
        start: pinTarget ? "top top" : "top 15%",
        end: () => `+=${Math.max(1100, window.innerHeight * 1.65)}`,
        pin: pinnedSection,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target = self.progress;
          container.dataset.progress = self.progress.toFixed(3);
        },
      });
      const render = () => {
        if (!visible) return;
        const delta = target - current;
        if (!dirty && Math.abs(delta) < 0.00001) return;
        current += delta * scrollEase;
        const H = viewport.width / 2;
        const B = Math.max(
          0.01,
          (Math.min(viewport.height * 0.32, viewport.width * 0.12) *
            Math.abs(bend)) /
            5,
        );
        const R = (H * H + B * B) / (2 * B);
        let visibleItems = 0;
        let cardsContained = true;
        media.forEach((item, index) => {
          const local = Math.max(
            0,
            Math.min(1, (current - index * 0.085) / 0.35),
          );
          const eased = 1 - Math.pow(1 - local, 3);
          const sidePadding = Math.max(18, viewport.width * 0.045);
          const spread = Math.min(
            viewport.width - sidePadding * 2 - item.mesh.scale.x * 1.6,
            item.mesh.scale.x * Math.max(1, media.length - 1) * 1.15,
          );
          const finalX = (index / Math.max(1, media.length - 1) - 0.5) * spread;
          const x =
            (H + item.mesh.scale.x * 1.2) * (1 - eased) + finalX * eased;
          const effectiveX = Math.min(Math.abs(x), H);
          const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
          item.mesh.position.x = x;
          const topPadding = Math.max(16, viewport.height * 0.055);
          const centerY = Math.min(
            viewport.height * 0.12,
            viewport.height / 2 - topPadding - item.mesh.scale.y / 2,
          );
          item.mesh.position.y = centerY - arc;
          item.mesh.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
          item.uniforms.uOpacity.value = Math.min(1, local * 3);
          if (local > 0.05) visibleItems++;
          if (local > 0.99) {
            const c = Math.abs(Math.cos(item.mesh.rotation.z));
            const s = Math.abs(Math.sin(item.mesh.rotation.z));
            const halfWidth =
              (c * item.mesh.scale.x + s * item.mesh.scale.y) / 2;
            const halfHeight =
              (s * item.mesh.scale.x + c * item.mesh.scale.y) / 2;
            if (
              Math.abs(x) + halfWidth > H ||
              Math.abs(item.mesh.position.y) + halfHeight > viewport.height / 2
            )
              cardsContained = false;
          }
          item.uniforms.uSpeed.value = delta;
        });
        container.dataset.visibleItems = String(visibleItems);
        container.dataset.cardsContained = String(cardsContained);
        renderer.render({ scene, camera });
        dirty = false;
      };
      container.dataset.renderer = "webgl";
      gsap.ticker.add(render);
      dispose = () => {
        alive = false;
        trigger.kill();
        observer.disconnect();
        intersection.disconnect();
        gsap.ticker.remove(render);
        media.forEach((item) => {
          item.image.onload = null;
          item.mesh.setParent(null);
          item.program.remove();
          gl.deleteTexture(item.texture.texture);
        });
        geometry.remove();
        gl.canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        delete container.dataset.renderer;
      };
      return () => dispose();
    });
    return () => motion.revert();
  }, [items, bend, borderRadius, scrollEase, pinTarget]);

  return (
    <div
      ref={containerRef}
      className={cn("circular-gallery", className)}
      {...props}
    >
      <div ref={canvasRef} className="circular-gallery-canvas" />
      <div className="circular-gallery-fallback" aria-hidden="true">
        {items.map((item, index) => (
          <img
            key={`${item.image}-${index}`}
            src={item.image}
            alt=""
            style={{ "--fallback-index": index } as CSSProperties}
          />
        ))}
      </div>
      <ul className="sr-only">
        {items.map((item, index) => (
          <li key={index}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}
