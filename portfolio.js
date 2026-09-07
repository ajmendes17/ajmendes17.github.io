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
