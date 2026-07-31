(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPower =
    (navigator.connection && navigator.connection.saveData) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  if (lowPower) {
    document.documentElement.classList.add("low-power");
  }

  const siteHeader = $(".site-header");
  const scrollProgress = $(".scroll-progress span");
  let scrollFrame = 0;
  const updateScrollEffects = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    if (scrollProgress) scrollProgress.style.setProperty("--scroll-progress", String(progress));
    if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    scrollFrame = 0;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
    },
    { passive: true }
  );
  updateScrollEffects();

  const menuButton = $(".menu-button");
  const mainNav = $(".main-nav");

  function closeMenu() {
    if (!menuButton || !mainNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      mainNav.classList.toggle("open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    $$(".nav-link", mainNav).forEach((link) => link.addEventListener("click", closeMenu));
  }

  $$(".nav-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const parent = toggle.closest(".nav-item");
      const open = parent.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu();
    $$(".nav-item.open").forEach((item) => item.classList.remove("open"));
    $$(".nav-toggle[aria-expanded='true']").forEach((toggle) =>
      toggle.setAttribute("aria-expanded", "false")
    );
  });

  const rotatingWord = $(".rotating-word");
  if (rotatingWord && !reduceMotion) {
    const words = ["Web Tasarım", "Google Haritalar", "SEO", "Sosyal Medya"];
    let wordIndex = 0;
    window.setInterval(() => {
      rotatingWord.classList.add("is-changing");
      window.setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        rotatingWord.textContent = words[wordIndex];
        rotatingWord.classList.remove("is-changing");
      }, 190);
    }, 2500);
  }

  const revealItems = $$(".reveal");
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-order", String(index % 6));
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  if (!reduceMotion && !lowPower && window.matchMedia("(pointer:fine)").matches) {
    $$(".service-card").forEach((card) => {
      let frame = 0;
      card.addEventListener("pointermove", (event) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${y * -2.4}deg) rotateY(${x * 3.2}deg) translateY(-5px)`;
        });
      });
      card.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        card.style.transform = "";
      });
    });
  }

  const kineticStage = $("[data-kinetic]");
  if (kineticStage && !reduceMotion && !lowPower && window.matchMedia("(pointer:fine)").matches) {
    let stageFrame = 0;
    kineticStage.addEventListener("pointermove", (event) => {
      if (stageFrame) cancelAnimationFrame(stageFrame);
      stageFrame = requestAnimationFrame(() => {
        const rect = kineticStage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 34;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 34;
        kineticStage.style.setProperty("--stage-x", `${x}px`);
        kineticStage.style.setProperty("--stage-y", `${y}px`);
      });
    });
    kineticStage.addEventListener("pointerleave", () => {
      if (stageFrame) cancelAnimationFrame(stageFrame);
      kineticStage.style.setProperty("--stage-x", "0px");
      kineticStage.style.setProperty("--stage-y", "0px");
    });
  }

  if (!reduceMotion && !lowPower && window.matchMedia("(pointer:fine)").matches) {
    $$(".button").forEach((button) => {
      button.classList.add("magnetic");
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
        button.style.transform = `translate3d(${x}px, ${y - 2}px, 0)`;
      });
      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });

    const cursorRing = $(".cursor-ring");
    const cursorDot = $(".cursor-dot");
    if (cursorRing && cursorDot) {
      document.documentElement.classList.add("cursor-enabled");
      let mouseX = -100;
      let mouseY = -100;
      let ringX = -100;
      let ringY = -100;
      let cursorAnimating = true;
      document.addEventListener(
        "pointermove",
        (event) => {
          mouseX = event.clientX;
          mouseY = event.clientY;
          cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        },
        { passive: true }
      );
      document.addEventListener("pointerover", (event) => {
        cursorRing.classList.toggle(
          "is-active",
          Boolean(event.target.closest("a, button, input, select, textarea, summary"))
        );
      });
      const animateCursor = () => {
        if (!cursorAnimating) return;
        ringX += (mouseX - ringX) * 0.17;
        ringY += (mouseY - ringY) * 0.17;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
      };
      document.addEventListener("visibilitychange", () => {
        cursorAnimating = !document.hidden;
        if (cursorAnimating) requestAnimationFrame(animateCursor);
      });
      requestAnimationFrame(animateCursor);
    }
  }

  const scoreForm = $("#digital-score-form");
  if (scoreForm) {
    scoreForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = $("#score-result");
      const valueNode = $("#score-value");
      const summary = $("#score-summary");
      const links = $("#score-links");
      const sector = new FormData(scoreForm).get("sector");

      if (!scoreForm.reportValidity() || !result || !valueNode || !summary || !links) return;

      const areas = [
        { key: "website", label: "Web Tasarım", href: "darende-web-tasarim/" },
        { key: "maps", label: "Google Haritalar", href: "darende-google-harita-yonetimi/" },
        { key: "social", label: "Sosyal Medya", href: "darende-sosyal-medya-yonetimi/" },
        { key: "seo", label: "SEO", href: "darende-seo/" },
        { key: "ads", label: "Google Ads", href: "darende-google-ads/" }
      ];
      const points = { yes: 20, partial: 10, no: 0 };
      let total = 0;
      const gaps = [];

      areas.forEach((area) => {
        const answer = new FormData(scoreForm).get(area.key);
        total += points[answer] || 0;
        if (answer !== "yes") gaps.push(area);
      });

      valueNode.textContent = String(total);
      const sectorText = sector ? `${sector} sektöründeki işletmeniz için ` : "İşletmeniz için ";
      if (total >= 80) {
        summary.textContent =
          sectorText +
          "temel dijital yapı güçlü görünüyor. Bir sonraki adım ölçüm, içerik kalitesi ve dönüşüm optimizasyonudur.";
      } else if (total >= 50) {
        summary.textContent =
          sectorText +
          "sağlam bir başlangıç var; eksik alanları önceliklendirerek daha tutarlı bir müşteri yolculuğu kurulabilir.";
      } else {
        summary.textContent =
          sectorText +
          "önce görünürlük ve güven temelini kurmak faydalı olacaktır. Aşağıdaki eksik alanlar iyi bir başlangıç sırası sunar.";
      }

      links.innerHTML = "";
      gaps.slice(0, 3).forEach((area) => {
        const link = document.createElement("a");
        link.href = area.href;
        link.textContent = area.label;
        links.appendChild(link);
      });
      if (!gaps.length) {
        const link = document.createElement("a");
        link.href = "iletisim/";
        link.textContent = "Strateji görüşmesi";
        links.appendChild(link);
      }

      result.classList.add("visible");
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  }

  const contactForm = $("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = $("#form-status");
      const endpoint = window.DARENDE_CONFIG && window.DARENDE_CONFIG.formEndpoint;
      const honey = contactForm.elements.website && contactForm.elements.website.value;

      if (honey || !status) return;
      if (!contactForm.reportValidity()) return;

      if (!endpoint) {
        status.innerHTML =
          'Çevrim içi form servisi henüz yapılandırılmadı. Lütfen <a href="tel:+905454644452">0545 464 44 52</a> numarasını arayın veya <a href="mailto:darendeajans@gmail.com">darendeajans@gmail.com</a> adresine yazın.';
        status.classList.add("visible");
        status.focus();
        return;
      }

      status.textContent = "Mesajınız gönderiliyor…";
      status.classList.add("visible");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Form servisi yanıt vermedi");
        status.textContent = "Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğiz.";
        contactForm.reset();
      } catch (_) {
        status.innerHTML =
          'Form şu anda gönderilemedi. Lütfen <a href="tel:+905454644452">telefonla arayın</a> veya <a href="mailto:darendeajans@gmail.com">e-posta gönderin</a>.';
      }
      status.focus();
    });
  }

  const mapButton = $("#show-map");
  if (mapButton) {
    mapButton.addEventListener("click", () => {
      const target = $("#map-consent-area");
      const url = window.DARENDE_CONFIG && window.DARENDE_CONFIG.mapEmbedUrl;
      if (!target) return;
      if (!url) {
        target.innerHTML =
          "<p>Kesin işletme adresi ve harita bağlantısı henüz tanımlanmadı. Hizmet bölgemiz Darende / Malatya’dır.</p>";
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.title = "Darende Ajans konum haritası";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.style.cssText = "width:100%;min-height:360px;border:0;border-radius:18px";
      target.replaceChildren(iframe);
    });
  }

  const weatherButton = $("#load-weather");
  if (weatherButton) {
    weatherButton.addEventListener("click", async () => {
      const reading = $("#weather-reading");
      const status = $("#weather-status");
      if (!reading || !status) return;
      weatherButton.disabled = true;
      status.textContent = "Open-Meteo üzerinden güncel veri alınıyor…";

      try {
        const geoResponse = await fetch(
          "https://geocoding-api.open-meteo.com/v1/search?name=Darende&count=5&language=tr&format=json"
        );
        if (!geoResponse.ok) throw new Error("Konum servisi yanıt vermedi");
        const geoData = await geoResponse.json();
        const place = (geoData.results || []).find(
          (item) => item.country_code === "TR" && /Malatya/i.test(item.admin1 || "")
        );
        if (!place) throw new Error("Darende konumu doğrulanamadı");

        const params = new URLSearchParams({
          latitude: String(place.latitude),
          longitude: String(place.longitude),
          current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
          timezone: "Europe/Istanbul"
        });
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!weatherResponse.ok) throw new Error("Hava servisi yanıt vermedi");
        const weather = await weatherResponse.json();
        const current = weather.current;
        const descriptions = {
          0: "Açık",
          1: "Çoğunlukla açık",
          2: "Parçalı bulutlu",
          3: "Kapalı",
          45: "Sisli",
          48: "Kırağılı sis",
          51: "Hafif çisenti",
          53: "Çisenti",
          55: "Yoğun çisenti",
          61: "Hafif yağmur",
          63: "Yağmur",
          65: "Kuvvetli yağmur",
          71: "Hafif kar",
          73: "Kar",
          75: "Yoğun kar",
          80: "Sağanak",
          81: "Sağanak",
          82: "Kuvvetli sağanak",
          95: "Gök gürültülü fırtına"
        };
        const date = new Date(current.time);
        reading.innerHTML = `
          <span class="weather-temp">${Math.round(current.temperature_2m)}°C</span>
          <strong>${descriptions[current.weather_code] || "Güncel koşullar"}</strong>
          <span>Hissedilen ${Math.round(current.apparent_temperature)}°C</span>
          <div class="weather-meta">
            <span>Nem: %${current.relative_humidity_2m}</span>
            <span>Rüzgâr: ${Math.round(current.wind_speed_10m)} km/sa</span>
            <span>Güncelleme: ${date.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}</span>
          </div>`;
        status.textContent = `Kaynak: Open-Meteo · Konum: ${place.name}, ${place.admin1}`;
      } catch (_) {
        reading.innerHTML =
          "<strong>Güncel hava verisi alınamadı.</strong><p>Uydurma veya önbellekten eski veri gösterilmedi.</p>";
        status.textContent =
          "Lütfen daha sonra tekrar deneyin veya Meteoroloji Genel Müdürlüğü’nün resmi tahminlerini kontrol edin.";
      } finally {
        weatherButton.disabled = false;
      }
    });
  }

  const backToTop = $(".back-to-top");
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 700);
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );
  }

  $$("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
