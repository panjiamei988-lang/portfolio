// ==================== CURSOR MODULE ====================
class CursorSystem {
  constructor() {
    this.cursorDot = document.querySelector('.cursor-dot');
    this.cursorFollower = document.querySelector('.cursor-follower');
    this.cursorText = document.querySelector('.cursor-text');
    this.isActive = false;
    this.isHovering = false;
    this.currentText = '';

    this.init();
  }

  init() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // Work item hover detection
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.cursorFollower.classList.add('hover');

        // Show project title
        const title = item.querySelector('.work-title').textContent;
        this.showText(title);
      });

      item.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.cursorFollower.classList.remove('hover');
        this.hideText();
      });
    });

    // Link hover detection
    const links = document.querySelectorAll('a, .nav-link');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      });
      link.addEventListener('mouseleave', () => {
        this.cursorFollower.style.borderColor = 'var(--color-accent-primary)';
      });
    });
  }

  handleMouseMove(e) {
    if (!this.isActive) return;

    const x = e.clientX;
    const y = e.clientY;

    // Update cursor dot
    this.cursorDot.style.left = x + 'px';
    this.cursorDot.style.top = y + 'px';

    // Update cursor follower with delay
    setTimeout(() => {
      this.cursorFollower.style.left = x + 'px';
      this.cursorFollower.style.top = y + 'px';
    }, 100);

    // Update cursor text position
    if (this.currentText) {
      this.cursorText.style.left = x + 'px';
      this.cursorText.style.top = (y - 40) + 'px';
    }
  }

  handleMouseEnter() {
    this.isActive = true;
    this.cursorDot.classList.add('active');
    this.cursorFollower.classList.add('active');
  }

  handleMouseLeave() {
    this.isActive = false;
    this.cursorDot.classList.remove('active');
    this.cursorFollower.classList.remove('active');
    this.hideText();
  }

  showText(text) {
    this.currentText = text;
    this.cursorText.textContent = text;
    this.cursorText.classList.add('visible');
  }

  hideText() {
    this.currentText = '';
    this.cursorText.classList.remove('visible');
  }
}

// ==================== SCROLL ANIMATION MODULE ====================
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    // Observe work items
    const workItems = document.querySelectorAll('.work-item');
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, this.observerOptions);

    workItems.forEach(item => {
      this.observer.observe(item);
    });

    // Hero animations
    this.animateHero();

    // Skills section animation
    this.animateSkills();
  }

  animateHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTagline = document.querySelector('.hero-tagline');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
          }, 100);

          setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
          }, 300);

          setTimeout(() => {
            heroTagline.style.opacity = '1';
            heroTagline.style.transform = 'translateY(0)';
          }, 500);
        }
      });
    }, { threshold: 0.5 });

    if (heroTitle) observer.observe(heroTitle);
  }

  animateSkills() {
    const sectionTitle = document.querySelector('.section-title');
    const skillsGrid = document.querySelector('.skills-grid');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionTitle.style.opacity = '1';
          sectionTitle.style.transform = 'translateY(0)';

          setTimeout(() => {
            skillsGrid.style.opacity = '1';
            skillsGrid.style.transform = 'translateY(0)';
          }, 200);
        }
      });
    }, this.observerOptions);

    if (sectionTitle) observer.observe(sectionTitle);
  }
}

// ==================== PARALLAX MODULE ====================
class ParallaxSystem {
  constructor() {
    this.init();
  }

  init() {
    const workImages = document.querySelectorAll('.work-image');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      workImages.forEach((image, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        image.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// ==================== PAGE NAVIGATION MODULE ====================
class PageNavigation {
  constructor() {
    this.init();
  }

  init() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ==================== PROJECT PAGE HANDLER ====================
class ProjectPageHandler {
  constructor() {
    this.init();
  }

  init() {
    // Handle URL parameter for project ID
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
      this.loadProject(projectId);
    }
  }

  loadProject(projectId) {
    // Placeholder for dynamic project loading
    console.log('Loading project:', projectId);

    // Update page title
    document.title = `${projectId.charAt(0).toUpperCase() + projectId.slice(1)} - Case Study`;

    // Add project-specific classes
    document.body.classList.add('project-page');
  }
}

// ==================== EXPORT FOR MODULAR LOADING ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CursorSystem,
    ScrollAnimations,
    ParallaxSystem,
    PageNavigation,
    ProjectPageHandler
  };
}

// Add dynamic background layer
document.addEventListener('DOMContentLoaded', () => {
  const fluidBg = document.querySelector('.fluid-bg');
  if (!fluidBg) {
    const bgElement = document.createElement('div');
    bgElement.className = 'fluid-bg';
    bgElement.innerHTML = '<div class="fluid-bg-layer"></div>';
    document.body.appendChild(bgElement);
  }
});