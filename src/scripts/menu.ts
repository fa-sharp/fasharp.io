const enableNavHamburgerToggle = () =>
  document.querySelector(".hamburger")?.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.toggle("expanded");
  });
enableNavHamburgerToggle();
document.addEventListener("astro:after-swap", enableNavHamburgerToggle);
