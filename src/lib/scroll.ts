import type Lenis from "lenis";

let instance: Lenis | null = null;
let lockCount = 0;

export function setLenis(next: Lenis | null) {
  instance = next;
  if (instance && lockCount > 0) instance.stop();
}

export function lockScroll() {
  lockCount += 1;
  document.documentElement.style.overflow = "hidden";
  instance?.stop();
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = "";
    instance?.start();
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, {
      offset: 0,
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
