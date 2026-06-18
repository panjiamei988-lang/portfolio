// ==================== PROJECT PAGE ENHANCEMENTS ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Applying project page enhancements...');

  // 1. 添加滚动动画
  addScrollAnimations();

  // 2. 优化导航
  enhanceNavigation();

  // 3. 添加项目图片懒加载
  addLazyLoading();

  // 4. 优化页面过渡
  enhancePageTransitions();

  console.log('✅ Project enhancements applied');
});

// 添加滚动动画
function addScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';

        // Stagger animation for timeline items
        if (entry.target.classList.contains('timeline-item')) {
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Observe all sections
  document.querySelectorAll('.case-section, .case-hero').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(section);
  });

  // Special animation for hero section
  const heroSection = document.querySelector('.case-hero');
  if (heroSection) {
    heroSection.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    heroSection.style.transitionDelay = '0.2s';
  }
}

// 优化导航
function enhanceNavigation() {
  const nav = document.querySelector('.nav-main');
  if (nav) {
    // Add smooth scroll behavior
    nav.style.transition = 'all 0.3s ease';

    // Update nav on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.backdropFilter = 'blur(20px)';
      } else {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
        nav.style.backdropFilter = 'blur(20px)';
      }

      lastScroll = currentScroll;
    });
  }
}

// 添加项目图片懒加载
function addLazyLoading() {
  const projectImages = document.querySelectorAll('.project-image, .project-image-split, .split-display-img, .case-text img');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.6s ease';
      }
    });
  });

  // 只对有 data-src 属性的图片使用懒加载
  projectImages.forEach(img => {
    if (img.dataset.src) {
      img.style.opacity = '0';
      imageObserver.observe(img);
    }
  });
}

// 优化页面过渡
function enhancePageTransitions() {
  // Add entrance animation
  document.body.style.opacity = '0';

  setTimeout(() => {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '1';
  }, 100);

  // Add hover effects to timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.3s ease';

    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(10px)';
      item.style.background = 'rgba(255, 42, 42, 0.1)';
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
      item.style.background = 'transparent';
    });
  });

  // Add smooth reveal to content
  const caseTexts = document.querySelectorAll('.case-text');
  caseTexts.forEach(text => {
    text.style.opacity = '0';
    text.style.transform = 'translateY(20px)';
    text.style.transition = 'all 0.6s ease 0.3s';

    // Trigger animation when parent is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          text.style.opacity = '1';
          text.style.transform = 'translateY(0)';
        }
      });
    });

    observer.observe(text.parentElement);
  });
}