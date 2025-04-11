/**
 * Main JavaScript for Likang Li's academic homepage
 * Optimized for performance and user experience
 */

(function() {
    'use strict';
    
    // 立即初始化主题以避免闪烁
    initTheme();
    
    // 注册Service Worker以支持离线访问 - 延迟注册以优先处理UI渲染
    setTimeout(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./js/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('ServiceWorker registration failed:', error);
                });
        }
    }, 1000);
    
    // 初始化主题
    function initTheme() {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');
        const currentTheme = storedTheme || (prefersDarkMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    }
    
    // 更新主题图标
    function updateThemeIcon(theme) {
        const themeSwitch = document.getElementById('theme-switch');
        if (!themeSwitch) return;
        
        const icon = themeSwitch.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // 初始化动画 - 优化性能
    function initAnimations() {
        // 显示所有元素初始状态
        document.querySelectorAll('[data-aos]').forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });

        if ('IntersectionObserver' in window) {
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
            
            // 延迟初始化动画观察器
            setTimeout(() => {
                document.querySelectorAll('[data-aos]').forEach(element => {
                    observer.observe(element);
                });
            }, 100);
        }
    }
    
    // 初始化平滑滚动
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // 关闭移动端菜单（如果打开）
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        document.querySelector('.navbar-toggler').click();
                    }
                    
                    // 平滑滚动到目标位置
                    const headerOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 初始化回到顶部按钮
    function initBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;
        
        const scrollThreshold = 300;
        
        // 使用 requestAnimationFrame 优化滚动性能
        let ticking = false;
        
        function handleScroll() {
            if (window.pageYOffset > scrollThreshold) {
                if (!backToTopButton.classList.contains('visible')) {
                    backToTopButton.classList.add('visible');
                }
            } else {
                if (backToTopButton.classList.contains('visible')) {
                    backToTopButton.classList.remove('visible');
                }
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                });
                ticking = true;
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0, 
                behavior: 'smooth'
            });
        });
    }
    
    // 初始化所有功能 - 优化顺序
    function init() {        
        // 主题切换功能
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            themeSwitch.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }
        
        // 初始化基本UI功能
        initSmoothScrolling();
        initBackToTopButton();
        
        // 最后初始化动画
        setTimeout(initAnimations, 200);
    }
    
    // 当DOM准备就绪时启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 