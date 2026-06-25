// ==================== PROJECT DATA MANAGER ====================
class ProjectDataManager {
  constructor() {
    this.projects = [];
    this.dataVersion = '1.0';
    this.storageKey = 'portfolio-projects';
  }

  // 加载项目数据
  async loadProjects() {
    // 1. 首先尝试从localStorage加载
    const cached = localStorage.getItem(this.storageKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.version === this.dataVersion) {
          this.projects = data.projects;
          console.log('Loaded projects from cache:', this.projects.length);
          return this.projects;
        }
      } catch (e) {
        console.log('Invalid cached data, loading from source');
      }
    }

    // 2. 如果没有缓存或缓存无效，从JSON文件加载
    try {
      const response = await fetch('assets/projects-data.json');
      if (response.ok) {
        const data = await response.json();
        this.projects = data.projects || [];
        this.saveToLocalStorage();
        console.log('Loaded projects from JSON:', this.projects.length);
        return this.projects;
      }
    } catch (e) {
      console.log('Failed to load from JSON, using default projects');
    }

    // 3. 如果都失败，使用默认项目
    this.projects = this.getDefaultProjects();
    this.saveToLocalStorage();
    console.log('Loaded default projects:', this.projects.length);
    return this.projects;
  }

  // 保存到localStorage
  saveToLocalStorage() {
    const data = {
      version: this.dataVersion,
      lastUpdated: new Date().toISOString(),
      projects: this.projects
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // 获取默认项目（仅在紧急情况下使用）
  getDefaultProjects() {
    return [
      {
        id: 'eye-massager',
        title: 'Eye Massager',
        category: 'Wellness Design',
        description: 'Smart eye massager with advanced features',
        image: 'https://panjiamei988-lang.github.io/portfolio-images/images/images-074.png',
        problem: 'Traditional eye massagers lack personalization and effective user experience.',
        insight: 'Users need a personalized massage experience that adapts to their specific needs.',
        solution: 'An innovative eye massager with customizable massage patterns and smart technology.',
        process: [
          { step: '01', title: 'Research', desc: 'User interviews and market analysis' },
          { step: '02', title: 'Concept', desc: 'Customizable massage profiles' },
          { step: '03', title: 'Prototype', desc: 'Interactive pressure mapping system' },
          { step: '04', title: 'Testing', desc: 'User feedback sessions' }
        ]
      },
      {
        id: 'tesla-camera',
        title: 'Tesla Camera',
        category: 'Automotive Design',
        description: 'Autonomous vehicle camera interface design',
        image: 'https://panjiamei988-lang.github.io/portfolio-images/images/images-018.png',
        problem: 'Camera systems in autonomous vehicles need intuitive interfaces for monitoring.',
        insight: 'Drivers need clear visual feedback without overwhelming information.',
        solution: 'A minimalist camera interface design that provides essential information at a glance.',
        process: [
          { step: '01', title: 'Research', desc: 'Driver behavior studies' },
          { step: '02', title: 'Concept', desc: 'Minimalist interface design' },
          { step: '03', title: 'Prototype', desc: 'AR-enhanced visualization' },
          { step: '04', title: 'Testing', desc: 'Simulated driving scenarios' }
        ]
      }
    ];
  }

  // 获取所有项目
  getProjects() {
    return this.projects;
  }

  // 获取单个项目
  getProject(id) {
    return this.projects.find(p => p.id === id);
  }

  // 添加项目
  addProject(project) {
    this.projects.push({
      ...project,
      id: project.id || `project-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    this.saveToLocalStorage();
  }

  // 更新项目
  updateProject(id, updates) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      this.saveToLocalStorage();
    }
  }

  // 删除项目
  deleteProject(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveToLocalStorage();
  }

  // 搜索项目
  searchProjects(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.projects.filter(p =>
      p.title.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // 获取项目统计
  getStats() {
    return {
      total: this.projects.length,
      categories: [...new Set(this.projects.map(p => p.category))],
      lastUpdated: this.projects.length > 0 ?
        new Date(Math.max(...this.projects.map(p => new Date(p.createdAt || 0)))).toLocaleDateString() :
        'No projects'
    };
  }
}

// ==================== DATA-DRIVEN TEMPLATE GENERATOR ====================
class TemplateGenerator {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  // 生成index.html
  generateIndexHTML() {
    const projects = this.dataManager.getProjects();
    const projectsHTML = projects.map(project => `
        <article class="work-item" data-project="${project.id}" onclick="window.location.href='project.html?id=${project.id}'">
          <div class="work-image-wrapper">
            <img src="${project.image}"
                 alt="${project.title} - ${project.category}"
                 class="work-image"
                 loading="lazy">
          </div>
          <div class="work-content">
            <h3 class="work-title">${project.title}</h3>
            <p class="work-category">${project.category}</p>
          </div>
        </article>
    `).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Designer Portfolio</title>

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=PP+Editorial+New:wght@400;700;900&display=swap">

  <link rel="stylesheet" href="assets/styles.css">
  <link rel="stylesheet" href="assets/ultimate-fix.css">
</head>
<body>
  <nav class="nav-main">
    <div class="nav-container">
      <a href="#about" class="nav-link">About</a>
      <a href="#works" class="nav-link">Works</a>
      <a href="#skills" class="nav-link">Skills</a>
      <a href="#contact" class="nav-link">Contact</a>
    </div>
  </nav>

  <div class="fluid-bg"></div>
  <div class="noise-overlay"></div>

  <div class="cursor-dot"></div>
  <div class="cursor-follower"></div>
  <div class="cursor-text"></div>

  <section class="hero" id="about">
    <div class="hero-content">
      <h1 class="hero-title">Product Designer</h1>
      <h2 class="hero-subtitle">User-Centered Design</h2>
      <h3 class="hero-tagline">Framer Portfolio</h3>
    </div>
  </section>

  <section class="works" id="works">
    <div class="works-container">
\${projectsHTML}
    </div>
  </section>

  <section class="skills" id="skills">
    <div class="skills-container">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        <div class="skill-item">UI/UX Design</div>
        <div class="skill-item">Prototyping</div>
        <div class="skill-item">User Research</div>
        <div class="skill-item">Interaction Design</div>
        <div class="skill-item">Design Systems</div>
        <div class="skill-item">Framer</div>
      </div>
    </div>
  </section>

  <section class="contact" id="contact">
    <div class="contact-container">
      <h2 class="section-title">Get In Touch</h2>
      <p class="contact-text">Let's create something amazing together</p>
      <a href="mailto:contact@example.com" class="contact-link">contact@example.com</a>
    </div>
  </section>

  <script src="assets/script.js"></script>
  <script src="assets/minimal-fix.js"></script>
  <script src="assets/project-data-manager.js"></script>
</body>
</html>`;
  }

  // 生成project.html模板
  generateProjectHTMLTemplate() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Case Study - Product Designer</title>
  <link rel="stylesheet" href="assets/styles.css">
  <link rel="stylesheet" href="assets/project-styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=PP+Editorial+New:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body class="project-page">
  <nav class="nav-main">
    <div class="nav-container">
      <a href="index.html" class="nav-link">← Portfolio</a>
    </div>
  </nav>

  <section class="case-hero" data-section="hero">
    <div class="case-content">
      <h1 id="projectTitle">Loading...</h1>
      <h2 id="projectSubtitle">Loading...</h2>
      <img id="projectHeroImage" src="" alt="Project hero image" class="project-image">
    </div>
  </section>

  <section class="case-section" data-section="problem">
    <div class="case-content">
      <h2>Problem Statement</h2>
      <div id="problemContent" class="case-text">
        <p>Loading...</p>
      </div>
    </div>
  </section>

  <section class="case-section" data-section="insight">
    <div class="case-content">
      <h2>Key Insights</h2>
      <div id="insightContent" class="case-text">
        <p>Loading...</p>
      </div>
    </div>
  </section>

  <section class="case-section timeline" data-section="process">
    <div class="case-content">
      <h2>Design Process</h2>
      <div class="timeline-container" id="timeline-container">
        </div>
    </div>
  </section>

  <section class="case-section" data-section="final">
    <div class="case-content">
      <h2>Final Solution</h2>
      <div id="finalContent">
        <img id="finalResultImage" src="" alt="Final design result" class="project-image">
        <div class="final-description">
          <p>Loading...</p>
        </div>
      </div>
    </div>
  </section>

  <section class="case-section" data-section="reflection">
    <div class="case-content">
      <h2>Reflection & Learnings</h2>
      <div id="reflectionContent" class="case-text">
        <p>This project provided valuable insights into the importance of user-centered design and iterative development. Key learnings include...</p>
      </div>
    </div>
  </section>

  <script src="assets/script.js"></script>
  <script src="assets/project-enhancements.js"></script>
  <script src="assets/project-data-manager.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      const dataManager = new ProjectDataManager();
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('id');

      if (projectId) {
        const project = await dataManager.loadProject(projectId);
        if (project) {
          // Update content
          document.getElementById('projectTitle').textContent = project.title;
          document.getElementById('projectSubtitle').textContent = project.category;
          document.getElementById('projectHeroImage').src = project.image;
          document.getElementById('finalResultImage').src = project.image;

          document.getElementById('problemContent').innerHTML = \\\`<p>\\\${project.problem}</p>\\\`;
          document.getElementById('insightContent').innerHTML = \`<p>\\\${project.insight}</p>\\\`;

          // Update timeline
          const timelineHTML = project.process.map(step => \\\`
            <div class="timeline-item">
              <div class="timeline-marker">\\\${step.step}</div>
              <div class="timeline-content">
                <h3>\\\${step.title}</h3>
                <p>\\\${step.desc}</p>
              </div>
            </div>
          \\\`).join('');
          document.getElementById('timeline-container').innerHTML = timelineHTML;

          // Update description
          document.querySelector('.final-description p').textContent = project.solution;

          // Update title
          document.title = \\\`\\\${project.title} - Case Study\\\`;
        }
      }

      // Initialize scroll animations
      const sections = document.querySelectorAll('.case-section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });

      sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        observer.observe(section);
      });
    });
  </script>
</body>
</html>`;
  }
}

// ==================== INITIALIZATION ====================
if (typeof document !== 'undefined') {
  const dataManager = new ProjectDataManager();
  const templateGenerator = new TemplateGenerator(dataManager);

  window.ProjectDataManager = ProjectDataManager;
  window.TemplateGenerator = TemplateGenerator;

  console.log('Project Data Manager initialized');
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.project-detail-container');
  if (container) {
    if (sessionStorage.getItem('playDetailsEntrance') === 'true') {
      setTimeout(() => {
        container.classList.add('entrance-active');
        sessionStorage.removeItem('playDetailsEntrance');
      }, 100);
    } else {
      container.classList.add('entrance-active');
    }
  }
});

// ==================== AMBIENT BACKGROUND SYSTEM ====================
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || 'eye';

  // 1. 完整图片数据源（包含已配好的 9 张高定图）
  const ambientBgData = {
    'eye': [
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.1.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.2.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.3.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.4.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.5.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.6.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.7.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.8.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/1.9.png'
    ],
    'tesla': [
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.1.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.2.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.3.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.4.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.5.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.6.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.7.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.8.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/2.9.png'
    ],
    'nebulizer': [
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.1.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.2.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.3.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.4.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.5.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.6.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.7.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.8.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/3.9.png'
    ],
    'rescue': [
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.1.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.2.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.3.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.4.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.5.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.6.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.7.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.8.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/4.9.png'
    ],
    'rooftop': [
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.1.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.2.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.3.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.4.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.5.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.6.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.7.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.8.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/5.9.png'
    ], // 🌟 修复了这里的闭合逗号
    'exo': [
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.1.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.2.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.3.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.4.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.5.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.6.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.7.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.8.png',
      'https://panjiamei988-lang.github.io/portfolio-images/images/6.9.png'
    ]
  };

  const currentImgs = ambientBgData[projectId] || ambientBgData['eye'];
  const bgContainer = document.getElementById('dynamic-ambient-bg');
  
  if (bgContainer && currentImgs && currentImgs.length > 0) {
    let col1HTML = '';
    let col2HTML = '';
    let col3HTML = '';

    // 🌟 全自动智能发牌分配算法：无论多少张图，都能完美均匀分摊到 3 个滚动列中
    currentImgs.forEach((imgSrc, index) => {
      const imgTag = `<img src="${imgSrc}" alt="ambient item">`;
      if (index % 3 === 0) col1HTML += imgTag;
      else if (index % 3 === 1) col2HTML += imgTag;
      else col3HTML += imgTag;
    });

    // 🌟 首尾无缝克隆，实现动画中途100%隐形折返，不会断流
    col1HTML = col1HTML + col1HTML;
    col2HTML = col2HTML + col2HTML;
    col3HTML = col3HTML + col3HTML;

    // 动态渲染写入到具有运动类名的容器中
    bgContainer.innerHTML = `
      <div class="ambient-column col-up">${col1HTML}</div>
      <div class="ambient-column col-down animation-delay-1">${col2HTML}</div>
      <div class="ambient-column col-up">${col3HTML}</div>
    `;
    console.log(`✨ 成功将项目 [${projectId}] 的 9 张背景流动画注入到 3 个滚动列！`);
  }
});