(function() {
    'use strict';

    const THEME_KEY = 'theme';
    let currentTheme = initializeTheme();

    registerServiceWorker();

    function initializeTheme() {
        const storedTheme = localStorage.getItem(THEME_KEY);
        const theme = storedTheme || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        return theme;
    }

    function updateThemeControl(theme) {
        const themeSwitch = document.getElementById('theme-switch');
        if (!themeSwitch) {
            return;
        }
        const isDark = theme === 'dark';
        themeSwitch.textContent = isDark ? 'Light mode' : 'Dark mode';
        themeSwitch.setAttribute('aria-pressed', String(isDark));
    }

    function registerServiceWorker() {
        setTimeout(() => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.error('ServiceWorker registration failed:', error);
                    });
            }
        }, 1000);
    }

    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        if (!animatedElements.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(element => element.classList.add('aos-animate'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        setTimeout(() => {
            animatedElements.forEach(element => observer.observe(element));
        }, 100);
    }

    function initSmoothScrolling(closeNav) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') {
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (!targetElement) {
                    return;
                }

                e.preventDefault();

                if (typeof closeNav === 'function') {
                    closeNav();
                } else {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const navbarToggler = document.querySelector('.navbar-toggler');
                        if (navbarToggler) {
                            navbarToggler.click();
                        } else {
                            navbarCollapse.classList.remove('show');
                        }
                    }
                }

                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    function initNavbarToggle() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.getElementById('navbarNav');

        if (!navbarToggler || !navbarCollapse) {
            return null;
        }

        const showClass = 'show';

        const setExpandedState = (expanded) => {
            navbarToggler.setAttribute('aria-expanded', String(expanded));
            navbarToggler.classList.toggle('collapsed', !expanded);
        };

        const closeNav = () => {
            navbarCollapse.classList.remove(showClass);
            setExpandedState(false);
        };

        navbarToggler.addEventListener('click', () => {
            const shouldOpen = !navbarCollapse.classList.contains(showClass);
            navbarCollapse.classList.toggle(showClass, shouldOpen);
            setExpandedState(shouldOpen);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeNav();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) {
                closeNav();
            }
        });

        navbarCollapse.addEventListener('click', (event) => {
            const link = event.target.closest('a.nav-link');
            if (link) {
                closeNav();
            }
        });

        closeNav();

        return closeNav;
    }

    function initBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) {
            return;
        }

        const scrollThreshold = 500;
        let ticking = false;

        function handleScroll() {
            if (window.pageYOffset > scrollThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function init() {
        updateThemeControl(currentTheme);

        const closeNav = initNavbarToggle();

        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            themeSwitch.addEventListener('click', () => {
                const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', nextTheme);
                localStorage.setItem(THEME_KEY, nextTheme);
                currentTheme = nextTheme;
                updateThemeControl(nextTheme);

                if (typeof closeNav === 'function') {
                    closeNav();
                }
            });
        }

        initSmoothScrolling(closeNav);
        initBackToTopButton();
        setTimeout(initAnimations, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

