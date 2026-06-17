// ==================== DATA-DRIVEN INITIALIZATION ====================
class DataDrivenInitializer {
  constructor() {
    this.dataManager = new ProjectDataManager();
    this.init();
  }

  async init() {
    console.log('Initializing data-driven portfolio...');

    // 加载项目数据
    const projects = await this.dataManager.loadProjects();

    // 渲染作品列表
    this.renderWorks(projects);

    // 初始化其他功能
    this.initDarkMode();
    this.initScrollAnimations();
    this.initImagePreloader();
  }

  // 渲染作品列表
  renderWorks(projects) {
    const worksContainer = document.getElementById('works-container');
    if (!worksContainer) return;

    // 根据数据创建作品项
    const worksHTML = projects.map(project => {
      // 交替左右布局
      const isEvenIndex = projects.indexOf(project) % 2 === 0;

      return `
        <article class="work-item" data-project="${project.id}" onclick="window.location.href='project.html?id=${project.id}'">
          <div class="${isEvenIndex ? 'work-image-wrapper' : 'work-content'}">
            <img src="${project.image}"
                 alt="${project.title} - ${project.category}"
                 class="work-image"
                 loading="lazy"
                 data-project-id="${project.id}">
          </div>
          <div class="${isEvenIndex ? 'work-content' : 'work-image-wrapper'}">
            <h3 class="work-title">${project.title}</h3>
            <p class="work-category">${project.category}</p>
            <p class="work-description">${project.description}</p>
          </div>
        </article>
      `;
    }).join('');

    worksContainer.innerHTML = worksHTML;

    // 为每个图片添加加载状态
    this.setupImageLoading();
  }

  // 设置图片加载状态
  setupImageLoading() {
    const images = document.querySelectorAll('.work-image');

    images.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });

      img.addEventListener('error', () => {
        img.classList.add('error');
        const wrapper = img.closest('.work-image-wrapper');
        if (wrapper) {
          wrapper.innerHTML = `
            <div class="image-error">
              <div class="error-icon">🖼️</div>
              <div class="error-text">Image unavailable</div>
            </div>
          `;
        }
      });
    });
  }

  // 初始化暗色模式
  initDarkMode() {
    const html = document.documentElement;
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      z-index: 1000;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    // 检查本地存储的暗色模式设置
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      html.classList.add('dark-mode');
      darkModeToggle.innerHTML = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
      html.classList.toggle('dark-mode');
      const isDark = html.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
    });

    document.body.appendChild(darkModeToggle);
  }

  // 初始化滚动动画
  initScrollAnimations() {
    // 使用 Intersection Observer API
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // 观察所有作品项
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(50px)';
      item.style.transition = `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.1}s`;
      observer.observe(item);
    });

    // 观察其他部分
    const sections = document.querySelectorAll('.skills, .contact');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
      observer.observe(section);
    });
  }

  // 初始化图片预加载
  initImagePreloader() {
    const preloadImages = () => {
      const projectImages = document.querySelectorAll('.work-image');

      projectImages.forEach(img => {
        const src = img.src;
        if (src) {
          const tempImg = new Image();
          tempImg.onload = () => {
            img.classList.add('loaded');
          };
          tempImg.onerror = () => {
            img.classList.add('error');
          };
          tempImg.src = src;
        }
      });
    };

    // 页面加载完成后预加载图片
    window.addEventListener('load', preloadImages);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const initializer = new DataDrivenInitializer();

  // 监听路由变化（如果是单页应用）
  window.addEventListener('popstate', () => {
    initializer.init();
  });
});