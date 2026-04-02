document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // MENU
  // ======================
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      toggle.textContent = isActive ? "✖" : "☰";
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        toggle.textContent = "☰";
      });
    });
  }

  // ======================
  // MODO DIA / NOCHE
  // ======================
  const btnDiurno = document.getElementById('modo-diurno');
  const btnNocturno = document.getElementById('modo-nocturno');

  if (btnDiurno && btnNocturno) {
    btnDiurno.classList.add('active');

    btnDiurno.addEventListener('click', () => {
      document.body.classList.remove('modo-nocturno');
      btnDiurno.classList.add('active');
      btnNocturno.classList.remove('active');
    });

    btnNocturno.addEventListener('click', () => {
      document.body.classList.add('modo-nocturno');
      btnNocturno.classList.add('active');
      btnDiurno.classList.remove('active');
    });
  }

  // ======================
  // ACORDEON
  // ======================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      content.classList.toggle('show');
    });
  });
});