/**
 * Preloader and Intro Animation Logic
 */
const preloader = document.getElementById("preloader");

// Apply theme to preloader instantly to avoid flash of wrong theme
const savedThemeForPreloader =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
if (savedThemeForPreloader === "dark") {
  preloader.style.backgroundColor = "#121212";
  const preloaderLogo = preloader.querySelector("img");
  if (preloaderLogo) preloaderLogo.src = "assets/wlogo.png";
}

window.addEventListener("load", () => {
  if (preloader) {
    preloader.classList.add("hidden");
    preloader.addEventListener(
      "transitionend",
      () => {
        document.body.classList.add("intro-active");
        if (preloader) preloader.style.display = "none"; // Fully remove it
      },
      { once: true },
    );
  } else {
    document.body.classList.add("intro-active");
  }
});

/**
 * Main script execution after DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Hero Title Character Animation Setup
   */
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    const textContent = heroTitle.innerHTML; // Use innerHTML to preserve <br>
    heroTitle.innerHTML = ""; // Clear original text

    let charCount = 0;
    textContent.split(/(\s+|<br>)/).forEach((part) => {
      if (part === "<br>") {
        heroTitle.appendChild(document.createElement("br"));
        return;
      }
      if (part.trim().length === 0) {
        heroTitle.append(" ");
        return;
      }

      const wordWrapper = document.createElement("span");
      wordWrapper.style.display = "inline-block";

      part.split("").forEach((char) => {
        const charWrapper = document.createElement("span");
        charWrapper.className = "char-wrapper";
        const charSpan = document.createElement("span");
        charSpan.className = "char";
        charSpan.textContent = char;
        charSpan.style.transitionDelay = `${charCount * 0.02}s`;
        charWrapper.appendChild(charSpan);
        wordWrapper.appendChild(charWrapper);
        charCount++;
      });

      heroTitle.appendChild(wordWrapper);
    });
  }

  /**
   * Theme Switcher
   */
  const themeToggle = document.getElementById("theme-toggle");
  const logo = document.getElementById("logo");
  const logoLightSrc = "assets/logo.png";
  const logoDarkSrc = "assets/wlogo.png";

  const setTheme = (theme) => {
    document.body.setAttribute("data-theme", theme);
    logo.setAttribute("src", theme === "dark" ? logoDarkSrc : logoLightSrc);
    localStorage.setItem("theme", theme);
  };

  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(newTheme);
  });

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  /**
   * Custom cursor follower
   */
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
  }

  /**
   * Mobile menu toggle
   */
  const menuToggle = document.getElementById("menu-toggle");
  const menuLinks = document.querySelectorAll(".menu-nav__link");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-active");
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-active");
    });
  });

  /**
   * Project hover image reveal
   */
  const projectItems = document.querySelectorAll(".project-item");
  const imageContainer = document.querySelector(".project-image-container");

  if (imageContainer && window.matchMedia("(pointer: fine)").matches) {
    projectItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const imageUrl = item.getAttribute("data-image");
        if (imageUrl) {
          imageContainer.innerHTML = `<img src="${imageUrl}" alt="Project Image">`;
          imageContainer.style.opacity = "1";
        }
      });
      item.addEventListener("mouseleave", () => {
        imageContainer.style.opacity = "0";
      });
      item.addEventListener("mousemove", (e) => {
        const x = e.clientX - imageContainer.offsetWidth / 2;
        const y = e.clientY - imageContainer.offsetHeight / 2;
        imageContainer.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  /**
   * Featured project card 3D parallax effect
   */
  const featuredCards = document.querySelectorAll(".featured-card");

  if (window.matchMedia("(pointer: fine)").matches) {
    featuredCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /**
   * Scroll-triggered animations for other sections
   */
  const animatedElements = document.querySelectorAll("[data-animate]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.1 },
  );

  animatedElements.forEach((el) => observer.observe(el));
});
