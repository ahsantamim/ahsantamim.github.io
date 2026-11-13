"use client";

import { useEffect, useRef } from "react";

const SHELL_POINTS = 2600;
const RING_POINTS = 220;

/**
 * A breathing point-cloud sphere with a wireframe core and two orbiting rings,
 * looping forever. Three.js loads only when the modal first opens; with reduced
 * motion it renders one still frame.
 */
export function ContactOrb({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.className = "size-full opacity-0 transition-opacity duration-1000";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      const world = new THREE.Group();
      scene.add(world);

      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 64;
      const ctx = sprite.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
      const dot = new THREE.CanvasTexture(sprite);

      const ink = new THREE.Color();
      const accent = new THREE.Color();
      const dim = new THREE.Color();
      const readColors = () => {
        const styles = getComputedStyle(document.documentElement);
        ink.set(styles.getPropertyValue("--ink").trim() || "#ffffff");
        accent.set(styles.getPropertyValue("--motion").trim() || "#3b82f6");
        dim.set(styles.getPropertyValue("--faint").trim() || "#71717a");
      };
      readColors();

      // Shell: points spread evenly over a sphere, pushed in and out by layered waves.
      const base = new Float32Array(SHELL_POINTS * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < SHELL_POINTS; i++) {
        const y = 1 - (i / (SHELL_POINTS - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        base[i * 3] = Math.cos(golden * i) * r;
        base[i * 3 + 1] = y;
        base[i * 3 + 2] = Math.sin(golden * i) * r;
      }
      const shellGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(SHELL_POINTS * 3);
      const colors = new Float32Array(SHELL_POINTS * 3);
      shellGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      shellGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const shellMat = new THREE.PointsMaterial({
        size: 0.034,
        map: dot,
        vertexColors: true,
        transparent: true,
        alphaTest: 0.4,
        depthWrite: false,
      });
      const shell = new THREE.Points(shellGeo, shellMat);
      world.add(shell);

      const coreGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 1));
      const coreMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.22 });
      const core = new THREE.LineSegments(coreGeo, coreMat);
      world.add(core);

      const makeRing = (radius: number, tiltX: number, tiltZ: number) => {
        const pts = new Float32Array(RING_POINTS * 3);
        for (let i = 0; i < RING_POINTS; i++) {
          const a = (i / RING_POINTS) * Math.PI * 2;
          pts[i * 3] = Math.cos(a) * radius;
          pts[i * 3 + 2] = Math.sin(a) * radius;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        const mat = new THREE.PointsMaterial({
          size: 0.018,
          map: dot,
          color: dim,
          transparent: true,
          alphaTest: 0.4,
          depthWrite: false,
        });
        const satGeo = new THREE.BufferGeometry();
        satGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([radius, 0, 0]), 3));
        const satMat = new THREE.PointsMaterial({ size: 0.11, map: dot, color: accent, transparent: true, alphaTest: 0.4 });
        const ring = new THREE.Group();
        ring.add(new THREE.Points(geo, mat), new THREE.Points(satGeo, satMat));
        ring.rotation.set(tiltX, 0, tiltZ);
        world.add(ring);
        return { ring, geo, mat, satGeo, satMat };
      };
      const rings = [makeRing(1.9, 1.15, 0.35), makeRing(2.25, 1.35, -0.55)];

      const applyThemeColors = () => {
        readColors();
        coreMat.color.copy(ink);
        rings.forEach((r) => {
          r.mat.color.copy(dim);
          r.satMat.color.copy(accent);
        });
      };
      const themeWatch = new MutationObserver(applyThemeColors);
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Keep the rings in frame on narrow panels without shrinking the orb on wide ones.
        camera.position.z = Math.min(11, Math.max(7.2, 4.2 / (0.63 * camera.aspect)));
        camera.updateProjectionMatrix();
      };
      const sizeWatch = new ResizeObserver(resize);
      sizeWatch.observe(el);
      resize();

      const pointer = { x: 0, y: 0 };
      const tilt = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const mixed = new THREE.Color();
      const render = (ms: number) => {
        const t = ms / 1000;
        for (let i = 0; i < SHELL_POINTS; i++) {
          const x = base[i * 3];
          const y = base[i * 3 + 1];
          const z = base[i * 3 + 2];
          const wave =
            Math.sin(x * 2.6 + t * 0.9) * Math.sin(y * 2.2 + t * 0.7) * Math.sin(z * 2.8 - t * 0.8) +
            0.45 * Math.sin(x * 5.1 - t * 1.3 + y * 3.7);
          const r = 1.32 * (1 + 0.13 * wave);
          positions[i * 3] = x * r;
          positions[i * 3 + 1] = y * r;
          positions[i * 3 + 2] = z * r;

          const lift = Math.min(1, Math.max(0, (wave + 0.6) / 1.5));
          mixed.copy(dim).lerp(ink, lift);
          if (wave > 0.78) mixed.lerp(accent, Math.min(1, (wave - 0.78) * 3));
          colors[i * 3] = mixed.r;
          colors[i * 3 + 1] = mixed.g;
          colors[i * 3 + 2] = mixed.b;
        }
        shellGeo.attributes.position.needsUpdate = true;
        shellGeo.attributes.color.needsUpdate = true;

        tilt.x += (pointer.y * 0.25 - tilt.x) * 0.04;
        tilt.y += (pointer.x * 0.35 - tilt.y) * 0.04;
        world.rotation.x = 0.18 + tilt.x;
        world.rotation.y = t * 0.12 + tilt.y;
        core.rotation.set(-t * 0.21, t * 0.17, 0);
        rings[0].ring.rotation.y = t * 0.5;
        rings[1].ring.rotation.y = -t * 0.34;

        renderer.render(scene, camera);
      };

      if (reduce) render(2400);
      else renderer.setAnimationLoop(render);
      requestAnimationFrame(() => renderer.domElement.classList.replace("opacity-0", "opacity-100"));

      cleanup = () => {
        renderer.setAnimationLoop(null);
        window.removeEventListener("pointermove", onPointer);
        themeWatch.disconnect();
        sizeWatch.disconnect();
        shellGeo.dispose();
        shellMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        rings.forEach((r) => {
          r.geo.dispose();
          r.mat.dispose();
          r.satGeo.dispose();
          r.satMat.dispose();
        });
        dot.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
