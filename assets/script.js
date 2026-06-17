// ==================== CURSOR MODULE (优化：采用高级 LERP 线性插值平滑算法) ====================
class CursorSystem {
  constructor() {
    this.cursorDot = document.querySelector('.cursor-dot');
    this.cursorFollower = document.querySelector('.cursor-follower');
    this.cursorText = document.querySelector('.cursor-text');
    this.isActive = false;
    this.isHovering = false;
    this.currentText = '';

    // 用于惯性平滑追踪的坐标变量
    this.mouse = { x: 0, y: 0 };       // 鼠标当前真实坐标
    this.follower = { x: 0, y: 0 };    // 延迟圈圈当前渲染坐标
    this.textPos = { x: 0, y: 0 };     // 悬浮文字当前渲染坐标

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // 启动动画帧循环，代替原本卡顿的 setTimeout
    this.tick();

    // Work item hover detection
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.cursorFollower.classList.add('hover');
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
    const links = document.querySelectorAll('a, .nav-link, .skill-item, .contact-link');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.cursorFollower.classList.add('hover'); // 统一使用 CSS class 控制
      });
      link.addEventListener('mouseleave', () => {
        this.cursorFollower.classList.remove('hover');
      });
    });
  }

  // 每一帧都优雅呼吸的物理跟随逻辑
  tick() {
    if (this.isActive) {
      // 1. 小红点几乎无延迟紧跟鼠标
      this.cursorDot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;

      // 2. 核心：大圈圈使用 0.08 的缓动系数实现流体惯性（Lerp 算法）
      this.follower.x += (this.mouse.x - this.follower.x) * 0.08;
      this.follower.y += (this.mouse.y - this.follower.y) * 0.08;
      this.cursorFollower.style.transform = `translate3d(${this.follower.x}px, ${this.follower.y}px, 0) translate(-50%, -50%)`;

      // 3. 悬浮文字位置平滑跟踪
      if (this.currentText) {
        this.textPos.x += (this.mouse.x - this.textPos.x) * 0.12;
        this.textPos.y += (this.mouse.y - this.textPos.y) * 0.12;
        this.cursorText.style.transform = `translate3d(${this.textPos.x}px, ${this.textPos.y - 40}px, 0) translate(-50%, -100%)`;
      }
    }
    // 无限循环
    requestAnimationFrame(this.tick.bind(this));
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

// ==================== SCROLL ANIMATION MODULE (优化：不再硬编码 style，改用纯净 Class 触发) ====================
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px' // 稍微推迟进场时机，效果更有工业设计般的秩序感
    };

    this.init();
  }

  init() {
    // 1. 作品流滚动显现
    const workItems = document.querySelectorAll('.work-item');
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, this.observerOptions);

    workItems.forEach(item => this.observer.observe(item));

    // 2. Hero 屏元素动画（解耦 JS，将过渡任务完整交回给 CSS 处理）
    this.initHeroAnimations();

    // 3. 技能区域显现
    this.initSkillsAnimations();
  }

  initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTagline = document.querySelector('.hero-tagline');

    if (!heroTitle) return;

    // 为 Hero 屏元素绑定优雅的 CSS 过渡时长，不再硬编码
    [heroTitle, heroSubtitle, heroTagline].forEach(el => {
      if(el) el.style.transition = 'opacity var(--duration-slow) var(--ease-expo), transform var(--duration-slow) var(--ease-expo)';
    });

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 通过错落有致的渲染帧延迟，形成高级的自上而下阶梯式入场
          requestAnimationFrame(() => {
            setTimeout(() => { heroTitle.style.opacity = '1'; heroTitle.style.transform = 'translateY(0)'; }, 50);
            setTimeout(() => { heroSubtitle.style.opacity = '1'; heroSubtitle.style.transform = 'translateY(0)'; }, 150);
            setTimeout(() => { heroTagline.style.opacity = '1'; heroTagline.style.transform = 'translateY(0)'; }, 250);
          });
          heroObserver.unobserve(entry.target); // 激活后解除监听，释放内存
        }
      });
    }, { threshold: 0.2 });

    heroObserver.observe(document.querySelector('.hero'));
  }

  initSkillsAnimations() {
    const sectionTitle = document.querySelector('.section-title');
    const skillsGrid = document.querySelector('.skills-grid');

    if (!sectionTitle) return;

    [sectionTitle, skillsGrid].forEach(el => {
      if(el) el.style.transition = 'opacity var(--duration-slow) var(--ease-expo), transform var(--duration-slow) var(--ease-expo)';
    });

    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            sectionTitle.style.opacity = '1';
            sectionTitle.style.transform = 'translateY(0)';
            setTimeout(() => {
              skillsGrid.style.opacity = '1';
              skillsGrid.style.transform = 'translateY(0)';
            }, 100);
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    skillsObserver.observe(document.querySelector('.skills'));
  }
}

// ==================== PARALLAX MODULE (优化：高性能 CSS 变量结合，拒绝掉帧) ====================
class ParallaxSystem {
  constructor() {
    // 移动端由于没有鼠标且性能敏感，直接跳过视差机制
    if (window.innerWidth <= 768) return;
    this.init();
  }

  init() {
    const workImages = document.querySelectorAll('.work-image');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        // 利用 requestAnimationFrame 限制执行频率，使其与屏幕刷新率对齐（节流）
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;

          workImages.forEach((image, index) => {
            // 降低视差敏感度（0.05起步），避免图片疯狂上下乱窜
            const speed = 0.05 + (index * 0.02);
            const yPos = -(scrolled * speed);
            
            // 采用 3D 矩阵加速，强行逼迫显卡（GPU）渲染这一行，从而实现纵享丝滑
            image.style.transform = `translate3d(0, ${yPos}px, 0) scale(${image.parentElement.matches(':hover') ? 1.03 : 1})`;
          });

          ticking = false;
        });

        ticking = true;
      }
    }, { passive: true }); // 使用 passive 告诉浏览器该监听不会阻止滚动，极大提高移动/触控板滚动流畅度
  }
}

// ==================== PAGE NAVIGATION MODULE ====================
class PageNavigation {
  constructor() {
    this.init();
  }

  init() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href.startsWith('#')) return; // 防止拦截非锚点链接

        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
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
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
      this.loadProject(projectId);
    }
  }

  loadProject(projectId) {
    console.log('💎 High-fidelity project injection:', projectId);
    document.title = `${projectId.charAt(0).toUpperCase() + projectId.slice(1)} | Industrial Design Portfolio`;
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

// 确保流畅加载动态背景
document.addEventListener('DOMContentLoaded', () => {
  const fluidBg = document.querySelector('.fluid-bg');
  if (!fluidBg) {
    const bgElement = document.createElement('div');
    bgElement.className = 'fluid-bg';
    bgElement.innerHTML = '<div class="fluid-bg-layer"></div>';
    document.body.appendChild(bgElement);
  }
});