/* ==========================================================================
   AVAN STAT - Main Javascript Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STICKY NAVBAR ON SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // ==========================================
    // 2. MOBILE MENU DRAWER
    // ==========================================
    const burger = document.getElementById('nav-burger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };
    
    const closeMenu = () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    };
    
    burger.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // ==========================================
    // 3. STATS COUNT-UP ANIMATION
    // ==========================================
    const statCounts = document.querySelectorAll('.stat-count');
    const statsSection = document.getElementById('stats-section');
    let statsAnimated = false;
    
    const animateStats = () => {
        statCounts.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1500; // 1.5 seconds animation
            const startTimestamp = performance.now();
            
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                // Easing out function
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeProgress * target);
                
                stat.textContent = currentValue + (stat.textContent.includes('+') || target >= 100 && target !== 99 ? '+' : '');
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    stat.textContent = target + (target === 250 || target === 15 || target === 45 ? '+' : '');
                }
            };
            
            window.requestAnimationFrame(step);
        });
    };
    
    // Intersection Observer for Stats count-up
    if ('IntersectionObserver' in window && statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statsSection);
    } else if (statsSection) {
        // Fallback for older browsers
        animateStats();
    }
    
    // ==========================================
    // 4. ABOUT SKILLS PROGRESS BARS ANIMATION
    // ==========================================
    const skillProgresses = document.querySelectorAll('.skill-progress');
    const aboutSection = document.getElementById('about');
    
    const animateSkills = () => {
        skillProgresses.forEach(progress => {
            const width = progress.getAttribute('data-width');
            progress.style.width = width;
        });
    };
    
    // Intersection Observer for Skills
    if ('IntersectionObserver' in window && aboutSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        skillsObserver.observe(aboutSection);
    } else {
        // Fallback
        animateSkills();
    }
    

    
});
