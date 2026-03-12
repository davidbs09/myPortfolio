/* ========================
   NAVBAR — scroll state & active link
======================== */
const header = document.getElementById('header');
const backToTopBtn = document.getElementById('back-to-top');
const navList = document.getElementById('nav-list');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id], footer[id]');

function handleScroll() {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 40;

    header.classList.toggle('header--scrolled', isScrolled);
    backToTopBtn.classList.toggle('visible', scrollY > 320);

    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach(link => link.classList.remove('nav__link--active'));
            const active = document.querySelector(`.nav__link[href="#${section.id}"]`);
            if (active) active.classList.add('nav__link--active');
        }
    });
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ========================
    BACK TO TOP
======================== */
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================
    MOBILE MENU
======================== */
const navToggle = document.getElementById('nav-toggle');
const navOverlay = document.getElementById('nav-overlay');

function closeMenu() {
    navList.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('i').className = 'bx bx-menu';
}

navToggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navOverlay.classList.toggle('open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.querySelector('i').className = isOpen ? 'bx bx-x' : 'bx bx-menu';
});

navOverlay?.addEventListener('click', closeMenu);

navLinks.forEach(link => link.addEventListener('click', closeMenu));

/* ========================
    INFINITE SKILLS CAROUSEL
======================== */
(function initSkillsCarousel() {
    const track = document.querySelector('.skills__track');
    if (!track) return;

    const SPEED_PX_PER_S = 80; // pixels por segundo — aumente para mais rápido

    // Guarda os itens originais antes de qualquer clonagem
    const originalItems = Array.from(track.children);

    // Clona conjuntos completos até preencher pelo menos 2× a largura da tela
    function fillTrack() {
        const minWidth = window.innerWidth * 2;
        while (track.scrollWidth < minWidth) {
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
        }
        // Um conjunto extra de buffer para garantir transição suave
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    // Mede a largura de um conjunto original e aplica o offset + duração
    function applyMetrics() {
        const singleSetWidth = originalItems.reduce((acc, el) => acc + el.offsetWidth, 0);
        const duration = singleSetWidth / SPEED_PX_PER_S;
        track.style.setProperty('--carousel-offset', `-${singleSetWidth}px`);
        track.style.animationDuration = `${duration.toFixed(2)}s`;
    }

    fillTrack();
    requestAnimationFrame(applyMetrics);

    // Recalcula se a janela for redimensionada
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            fillTrack();
            requestAnimationFrame(applyMetrics);
        }, 200);
    }, { passive: true });
})();

/* ========================
    FADE-IN ON SCROLL
======================== */
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.project-card, .about__highlight-card, .contact__card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}