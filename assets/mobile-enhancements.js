// ==================== MOBILE ENHANCEMENTS ====================
class MobileEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupTouchGestures();
    this.setupPullToRefresh();
    this.setupLazyLoading();
    this.setupPerformanceOptimization();
    this.setupMobileMenu();
    this.setupAccelerometer();
  }

  // 设置触摸手势
  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      // 防止页面滚动时的误触
      if (Math.abs(e.touches[0].screenY - touchStartY) > 10) {
        return;
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;

      // 检测左右滑动
      if (touchEndX < touchStartX - 50) {
        // 左滑
        this.handleSwipeLeft();
      } else if (touchEndX > touchStartX + 50) {
        // 右滑
        this.handleSwipeRight();
      }

      // 检测上下滑动
      if (touchEndY < touchStartY - 100) {
        // 上滑
        this.handleSwipeUp();
      } else if (touchEndY > touchStartY + 100) {
        // 下滑
        this.handleSwipeDown();
      }
    }, { passive: true });
  }

  // 处理左滑
  handleSwipeLeft() {
    // 导航到下一个项目
    const currentProject = document.querySelector('.work-item.active');
    if (currentProject) {
      const nextProject = currentProject.nextElementSibling;
      if (nextProject && nextProject.classList.contains('work-item')) {
        nextProject.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nextProject.classList.add('active');
        currentProject.classList.remove('active');
      }
    }
  }

  // 处理右滑
  handleSwipeRight() {
    // 导航到上一个项目
    const currentProject = document.querySelector('.work-item.active');
    if (currentProject) {
      const prevProject = currentProject.previousElementSibling;
      if (prevProject && prevProject.classList.contains('work-item')) {
        prevProject.scrollIntoView({ behavior: 'smooth', block: 'center' });
        prevProject.classList.add('active');
        currentProject.classList.remove('active');
      }
    }
  }

  // 处理上滑
  handleSwipeUp() {
    // 滚动到下一个部分
    const currentSection = document.querySelector('.case-section.visible');
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection && nextSection.classList.contains('case-section')) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // 处理下滑
  handleSwipeDown() {
    // 滚动到上一个部分
    const currentSection = document.querySelector('.case-section.visible');
    if (currentSection) {
      const prevSection = currentSection.previousElementSibling;
      if (prevSection && prevSection.classList.contains('case-section')) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // 设置下拉刷新
  setupPullToRefresh() {
    let pullStartY = 0;
    let pullDistance = 0;
    let isPulling = false;
    const pullThreshold = 100; // 下拉阈值

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        pullStartY = e.touches[0].pageY;
        isPulling = true;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;

      const currentY = e.touches[0].pageY;
      pullDistance = currentY - pullStartY;

      if (pullDistance > 0) {
        e.preventDefault();

        // 显示下拉刷新指示器
        const indicator = document.getElementById('pull-to-refresh') || this.createPullToRefreshIndicator();
        indicator.style.transform = `translateY(${Math.min(pullDistance / 2, 50)}px)`;

        if (pullDistance >= pullThreshold) {
          indicator.classList.add('ready');
          indicator.textContent = '释放刷新';
        } else {
          indicator.classList.remove('ready');
          indicator.textContent = '下拉刷新';
        }
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (!isPulling) return;

      const indicator = document.getElementById('pull-to-refresh');

      if (pullDistance >= pullThreshold) {
        // 执行刷新
        this.handlePullToRefresh();
      }

      // 重置状态
      isPulling = false;
      pullDistance = 0;

      if (indicator) {
        indicator.style.transform = 'translateY(0)';
        setTimeout(() => {
          indicator.remove();
        }, 300);
      }
    }, { passive: true });
  }

  // 创建下拉刷新指示器
  createPullToRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'pull-to-refresh';
    indicator.className = 'pull-to-refresh';
    indicator.textContent = '下拉刷新';
    document.body.appendChild(indicator);
    return indicator;
  }

  // 处理下拉刷新
  async handlePullToRefresh() {
    const indicator = document.getElementById('pull-to-refresh');
    indicator.textContent = '正在刷新...';

    try {
      // 刷新数据
      if (window.dataManager) {
        await window.dataManager.loadProjects();
        // 重新渲染项目
        if (window.initializer) {
          window.initializer.renderWorks(window.dataManager.getProjects());
        }
      }

      indicator.textContent = '刷新成功';
      setTimeout(() => {
        indicator.remove();
      }, 1000);

    } catch (error) {
      indicator.textContent = '刷新失败';
      setTimeout(() => {
        indicator.remove();
      }, 1000);
    }
  }

  // 设置懒加载
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1
      });

      // 观察所有懒加载图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 降级方案
      this.setupFallbackLazyLoading();
    }
  }

  // 设置降级懒加载
  setupFallbackLazyLoading() {
    const checkImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const windowHeight = window.innerHeight;

      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top <= windowHeight + 100) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
        }
      });

      if (images.length === 0) {
        window.removeEventListener('scroll', checkImages);
      }
    };

    window.addEventListener('scroll', checkImages);
    checkImages(); // 初始检查
  }

  // 设置性能优化
  setupPerformanceOptimization() {
    // 减少动画以节省电量
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) {
      document.documentElement.style.setProperty('--duration-normal', '0ms');
      document.documentElement.style.setProperty('--duration-slow', '0ms');
    }

    // 优化滚动性能
    let ticking = false;
    const updateScrollEffects = () => {
      // 更新视差效果
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');

      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      // 更新导航栏透明度
      const nav = document.querySelector('.nav-main');
      if (nav) {
        const opacity = Math.min(scrolled / 100, 1);
        nav.style.background = `rgba(0, 0, 0, ${0.95 + opacity * 0.05})`;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    // 优化触摸事件
    let touchTimeout;
    document.addEventListener('touchend', () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
      touchTimeout = setTimeout(() => {
        this.handleTouchEnd();
      }, 100);
    }, { passive: true });
  }

  // 处理触摸结束
  handleTouchEnd() {
    // 可以在这里添加触摸结束后的逻辑
    // 例如：记录用户触摸模式偏好
  }

  // 设置移动端菜单
  setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      // 点击链接后关闭菜单
      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });

      // 点击外部关闭菜单
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });
    }
  }

  // 设置加速度计（可选功能）
  setupAccelerometer() {
    if (window.DeviceOrientationEvent) {
      let lastOrientation = null;

      const handleOrientation = (event) => {
        const { beta, gamma } = event; // beta: 前后倾斜, gamma: 左右倾斜

        // 检测设备是否被摇动
        if (lastOrientation) {
          const deltaBeta = Math.abs(beta - lastOrientation.beta);
          const deltaGamma = Math.abs(gamma - lastOrientation.gamma);

          if (deltaBeta > 30 || deltaGamma > 30) {
            this.handleShake();
          }
        }

        lastOrientation = { beta, gamma };
      };

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  // 处理摇晃事件
  handleShake() {
    // 可以在这里添加摇晃后的逻辑
    // 例如：显示隐藏的功能、刷新数据等
    console.log('Device shaken!');

    // 显示提示
    const hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.textContent = '已摇晃设备，功能已激活';
    document.body.appendChild(hint);

    setTimeout(() => {
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 300);
    }, 2000);
  }

  // 添加移动端特有的类
  addMobileClasses() {
    if ('ontouchstart' in window) {
      document.documentElement.classList.add('touch-device');
    }

    // 检测设备类型
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.documentElement.classList.add('ios-device');
    } else if (/Android/.test(navigator.userAgent)) {
      document.documentElement.classList.add('android-device');
    }

    // 检测屏幕方向
    const checkOrientation = () => {
      if (window.innerWidth > window.innerHeight) {
        document.documentElement.classList.add('landscape');
      } else {
        document.documentElement.classList.remove('landscape');
      }
    };

    window.addEventListener('resize', checkOrientation);
    checkOrientation();
  }
}

// 初始化移动端增强
if (typeof document !== 'undefined') {
  const mobileEnhancements = new MobileEnhancements();
  mobileEnhancements.addMobileClasses();
  window.MobileEnhancements = MobileEnhancements;
  console.log('Mobile enhancements initialized');
}