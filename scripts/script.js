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