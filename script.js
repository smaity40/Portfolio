      const $ = (s) => document.querySelector(s),
        $$ = (s) => document.querySelectorAll(s);
      $("#y").textContent = new Date().getFullYear();

      // Theme toggle
      $("#theme").onclick = () => {
        const h = document.documentElement;
        h.dataset.theme = h.dataset.theme === "dark" ? "light" : "dark";
      };
      // Mobile menu
      $("#menu").onclick = () => $("#nav").classList.toggle("open");
      $$("#nav a").forEach(
        (a) => (a.onclick = () => $("#nav").classList.remove("open")),
      );

      // Typing effect: edit roles here
      const roles = [
        "Data Analyst",
        "Machine Learning Engineer",
        "Python Developer",
        "B.Tech CSE Student",
      ];
      const el = $("#typed"),
        still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let r = 0,
        i = 0,
        d = false;
      (function t() {
        const w = roles[r];
        el.textContent = w.slice(0, i);
        if (!d && i === w.length) {
          d = true;
          return setTimeout(t, 1400);
        }
        if (d && i === 0) {
          d = false;
          r = (r + 1) % roles.length;
        }
        i += d ? -1 : 1;
        setTimeout(t, d ? 45 : 90);
      })();
      if (still) {
        el.textContent = roles[0];
      }

      // Scroll progress + active link + sliding nav underline + back-to-top
      const secs = [...$$("main,section")];
      const navLine = $("#navLine");
      function moveNavLine(a) {
        if (!a || !navLine) return;
        navLine.style.left = a.offsetLeft + "px";
        navLine.style.width = a.offsetWidth + "px";
        navLine.style.opacity = 1;
      }
      addEventListener("scroll", () => {
        const h = document.documentElement;
        $("#bar").style.width =
          (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
        let cur = "";
        secs.forEach((s) => {
          if (scrollY >= s.offsetTop - 120) cur = s.id;
        });
        let activeLink = null;
        $$("#nav a").forEach((a) => {
          const on = a.getAttribute("href") === "#" + cur;
          a.classList.toggle("on", on);
          if (on) activeLink = a;
        });
        moveNavLine(activeLink);
        $("#toTop").classList.toggle("show", h.scrollTop > 500);
      });
      $("#toTop").onclick = () =>
        scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });

      // Staggered reveal: cards in the same group fade in one after another
      $$(".skills, .projects, .certrow, .stats").forEach((group) => {
        [...group.children].forEach((child, idx) => {
          if (child.classList.contains("rv")) {
            child.style.setProperty("--rvd", still ? "0s" : idx * 0.08 + "s");
          }
        });
      });

      // Subtle 3D tilt on project cards
      if (!still) {
        $$(".proj").forEach((card) => {
          card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
          });
          card.addEventListener("mouseleave", () => {
            card.style.transform = "";
          });
        });
      }

      // Reveal + count-up
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("in");
            e.target.querySelectorAll("[data-n]").forEach((c) => {
              const n = +c.dataset.n;
              let k = 0;
              const s = setInterval(
                () => {
                  c.textContent = ++k;
                  if (k >= n) clearInterval(s);
                },
                still ? 1 : 90,
              );
            });
            io.unobserve(e.target);
          }),
        { threshold: 0.15 },
      );
      $$(".rv").forEach((n) => io.observe(n));

      // Project filter
      $$(".filters button").forEach(
        (b) =>
          (b.onclick = () => {
            $$(".filters button").forEach((x) => x.classList.remove("on"));
            b.classList.add("on");
            $$(".proj").forEach(
              (p) =>
                (p.style.display =
                  b.dataset.f === "all" || p.dataset.c === b.dataset.f
                    ? ""
                    : "none"),
            );
          }),
      );

      // Certificate lightbox: opens the clicked certificate's photo in-page
      function openCert(card) {
        const img = card.querySelector("img.shot");
        $("#lbImg").src = img.src; // uses whatever actually loaded (real photo or placeholder)
        $("#lbTitle").textContent = card.dataset.title || "";
        $("#lbPlatform").textContent = card.dataset.platform || "";
        $("#certLightbox").classList.add("open");
        document.body.style.overflow = "hidden";
      }
      function closeCert() {
        $("#certLightbox").classList.remove("open");
        document.body.style.overflow = "";
      }
      addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCert();
      });

      // Contact form -> opens email app (change the address)
      $("#form").onsubmit = (e) => {
        e.preventDefault();
        const body = encodeURIComponent(
          $("#fm").value +
            "\n\nFrom: " +
            $("#fn").value +
            " (" +
            $("#fe").value +
            ")",
        );
        location.href =
          "mailto:subhajitmaity427@gmail.com?subject=" +
          encodeURIComponent("Portfolio message from " + $("#fn").value) +
          "&body=" +
          body;
      };
