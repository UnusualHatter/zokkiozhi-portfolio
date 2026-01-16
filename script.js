document.addEventListener('DOMContentLoaded', () => {
    console.log('SCRIPT STARTED - DOMContentLoaded');
    AOS.init({
        duration: 800,
        once: true,
        offset: 50
    });

    loadData();

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    document.getElementById('gallery-grid').addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            const img = item.querySelector('img');
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        }
    });

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

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerText = '☀';
    }

    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') !== 'dark';
        document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
        themeToggle.innerText = isLight ? '☀' : '☾';
        localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
});

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
            document.getElementById('nav-logo').innerText = config.name;
            document.getElementById('hero-title').innerText = config.name;
            document.title = `${config.name} | Portfolio`;
        }

        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = '';
        if (artworks.length === 0) {
            grid.innerHTML = '<p class="empty-state">No artworks found. Edit <strong>data/artworks.json</strong> to add images.</p>';
        } else {
            artworks.forEach((art, index) => {
                const el = document.createElement('div');
                // Default to size 1 if not specified
                const sizeClass = art.size ? `size-${art.size}` : 'size-1';
                el.className = `gallery-item ${sizeClass} fluid-reveal`;
                el.style.animationDelay = `${index * 100}ms`;

                el.innerHTML = `<img src="${art.src}" alt="${art.title || ''}" loading="lazy">`;
                grid.appendChild(el);
            });
        }

        setTimeout(() => AOS.refresh(), 100);

        const linksGrid = document.getElementById('links-grid');
        const linksSection = document.getElementById('links');

        linksGrid.innerHTML = '';

        if (socials.length > 0) {
            // linksSection.classList.remove('hidden'); // Removed hidden logic as requested
            socials.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                const iconClass = link.icon ? link.icon : 'fa-solid fa-link';
                a.innerHTML = `<i class="${iconClass}"></i>`;
                a.title = link.name;
                linksGrid.appendChild(a);
            });
        }

    } catch (e) { console.error(e); }
}
