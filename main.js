document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = 'light'; // Default to light theme
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.getAttribute('href') !== '#') {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }
  });

  // Navigation active state
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        if (link.parentElement) {
          link.parentElement.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.parentElement.classList.add('active');
          }
        }
      });
    });
  }

  // Improved animation handling for hero section
  const heroContent = document.querySelector('.hero-content');
  const heroAnimation = document.querySelector('.hero-animation');
  
  if (heroContent && heroAnimation) {
    // Initial states
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(50px)';
    heroAnimation.style.opacity = '0';
    heroAnimation.style.transform = 'scale(0.9)';
    
    // Animate content
    setTimeout(() => {
      heroContent.style.transition = 'all 0.8s ease-out';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
    
    // Animate lottie player
    setTimeout(() => {
      heroAnimation.style.transition = 'all 0.8s ease-out';
      heroAnimation.style.opacity = '1';
      heroAnimation.style.transform = 'scale(1)';
    }, 300);
  }

  // Animation for feature cards
  const cards = document.querySelectorAll('.feature-card');
  if (cards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.95)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksMobile = document.querySelector('.nav-links');

  if (menuToggle && navLinksMobile) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinksMobile.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinksMobile.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinksMobile.classList.remove('active');
      }
    });

    // Close menu when clicking a link
    navLinksMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksMobile.classList.remove('active');
      });
    });
  }

  // Add resize handler for responsive animation
  window.addEventListener('resize', () => {
    const lottiePlayer = document.querySelector('lottie-player');
    if (lottiePlayer) {
      if (window.innerWidth <= 768) {
        lottiePlayer.style.width = '100%';
        lottiePlayer.style.height = 'auto';
      } else {
        lottiePlayer.style.width = '600px';
        lottiePlayer.style.height = '600px';
      }
    }
  });
});