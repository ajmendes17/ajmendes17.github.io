const copyButton = document.querySelector("[data-copy-email]");
copyButton?.addEventListener("click", async () => {
  const status = document.querySelector(".copy-status");
  try {
    await navigator.clipboard.writeText("ajmendes17@gmail.com");
    status.textContent = "Email copied.";
  } catch {
    status.textContent = "Copy this address: ajmendes17@gmail.com";
  }
});

// Animate only visible illustrations, with one control and OS motion support.
const motionButton = document.querySelector(".motion-toggle");
if (motionButton) {
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let paused = false;
  const syncMotion = () => {
    const reduced = motionPreference.matches;
    document.body.classList.toggle("motion-enabled", !reduced);
    document.body.classList.toggle("motion-paused", paused || reduced);
    motionButton.hidden = false;
    motionButton.disabled = reduced;
    motionButton.setAttribute("aria-pressed", String(paused || reduced));
    motionButton.textContent = reduced
      ? "Reduced motion on"
      : paused
        ? "Play motion"
        : "Pause motion";
  };
  motionButton.addEventListener("click", () => {
    paused = !paused;
    syncMotion();
  });
  motionPreference.addEventListener("change", syncMotion);
  const scenes = document.querySelectorAll(
    ".hero-art, .integration-art, .chat-art, .ml-art, .clue-art, .kinetic-figure",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        entry.target.classList.toggle("is-inview", entry.isIntersecting),
      );
    },
    { threshold: 0.15 },
  );
  scenes.forEach((scene) => {
    scene.classList.add("motion-scene");
    observer.observe(scene);
  });
  syncMotion();
}
