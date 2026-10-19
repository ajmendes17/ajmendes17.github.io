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

// Animate project illustrations when visible, respecting the OS motion setting.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionScenes = document.querySelectorAll(
  ".integration-art, .chat-art, .ml-art, .clue-art, .kinetic-figure",
);
const syncMotionPreference = () => {
  document.body.classList.toggle("motion-enabled", !motionPreference.matches);
  document.body.classList.toggle("motion-paused", motionPreference.matches);
};
syncMotionPreference();
motionPreference.addEventListener("change", syncMotionPreference);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        entry.target.classList.toggle("is-inview", entry.isIntersecting),
      );
    },
    { threshold: 0.15 },
  );
  motionScenes.forEach((scene) => {
    scene.classList.add("motion-scene");
    observer.observe(scene);
  });
}
