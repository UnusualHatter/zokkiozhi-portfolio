document.addEventListener('DOMContentLoaded', () => {
    // AOS Init
    AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-back'
    });

    loadData();

    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(l => {
            l.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    if (document.getElementById('gallery-grid')) {
        document.getElementById('gallery-grid').addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const img = item.querySelector('img');
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeToggle.innerText = isDark ? '\u263E' : '\u2600';
        });
    }

    // Confetti Effect
    window.addEventListener('scroll', () => {
        if (Math.random() > 0.95) createConfetti();
    });
});

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');


    const colors = ['#FF69B4', '#FFB347', '#00BFFF', '#ADFF2F'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';

    document.body.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

async function loadData() {
    try {
        const [configRes, artworksRes, socialsRes] = await Promise.all([
            fetch('data/config.json'),
            fetch('data/artworks.json'),
            fetch('data/socials.json')
        ]);
        const config = await configRes.json();
        const artworks = await artworksRes.json();
        const socials = await socialsRes.json();

        if (config.name) {
            const logo = document.getElementById('nav-logo');
            if (logo) logo.innerHTML = `<i class="fa-solid fa-heart"></i> ${config.name}`;
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) heroTitle.innerText = config.name;
        }

        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = '';
        if (artworks.length > 0) {
            artworks.forEach((art, idx) => {
                const el = document.createElement('div');
                el.className = 'gallery-item';
                el.setAttribute('data-aos', 'zoom-in');
                el.setAttribute('data-aos-delay', idx * 50);
                el.innerHTML = `<img src="${art.src}" alt="${art.title}">`;
                grid.appendChild(el);
            });
        } else {
            grid.innerHTML = '<p>No artworks found :(</p>';
        }

        const linksGrid = document.getElementById('links-grid');
        linksGrid.innerHTML = '';
        if (socials.length > 0) {
            socials.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.className = 'social-link';
                a.innerHTML = `<i class="${link.icon}"></i>`;
                linksGrid.appendChild(a);
            });
        }

    } catch (e) { console.error(e); }
}