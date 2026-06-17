// ==================== PDF CONTENT EXTRACTOR ====================
class PDFExtractor {
  constructor() {
    this.pdfData = null;
    this.projects = [];
    this.extracted = false;
    this.templatePattern = this.initializeTemplatePattern();
  }

  initializeTemplatePattern() {
    return {
      // 项目基本信息
      projectTitle: /(?:项目|标题)[:：]\s*([^\n]+)/gi,
      projectCategory: /(?:类别|分类)[:：]\s*([^\n]+)/gi,
      projectDescription: /(?:描述|简介)[:：]\s*([^\n]+)/gi,
      projectImage: /(?:图片|配图)[:：]\s*([^\n]+)/gi,

      // 项目内容
      problem: /(?:问题|挑战)[:：]\s*([^\n]+)/gi,
      insight: /(?:洞察|发现)[:：]\s*([^\n]+)/gi,
      solution: /(?:解决方案|成果)[:：]\s*([^\n]+)/gi,
      technologies: /(?:技术|工具)[：:]\s*([^\n]+)/gi,
      results: /(?:结果|成效)[：:]\s*([^\n]+)/gi,

      // 设计过程
      processStep: /(?:步骤|阶段)\s*(\d+)[：:]\s*([^\n]+)/gi,
      processTitle: /(?:步骤|阶段)\s*\d+[：:]\s*[^\n]*\n\s*标题[:：]\s*([^\n]+)/gi,
      processDesc: /(?:步骤|阶段)\s*\d+[：:]\s*[^\n]*\n\s*描述[:：]\s*([^\n]+)/gi
    };
  }

  // 读取PDF文件
  async readPDF(file) {
    try {
      console.log('开始读取PDF文件:', file.name);

      // 使用FileReader读取PDF
      const arrayBuffer = await file.arrayBuffer();

      // 使用pdf.js解析PDF
      const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
      const pdf = await loadingTask.promise;

      console.log(`PDF包含 ${pdf.numPages} 页`);

      // 提取所有页面内容
      const fullText = await this.extractAllText(pdf);

      // 解析项目信息
      this.parseProjects(fullText);

      this.extracted = true;
      console.log('成功提取', this.projects.length, '个项目');
      return this.projects;

    } catch (error) {
      console.error('PDF读取失败:', error);
      throw error;
    }
  }

  // 提取PDF所有文本
  async extractAllText(pdf) {
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  }

  // 解析项目信息
  parseProjects(text) {
    // 使用正则表达式提取项目信息
    const projectPattern = /项目\d+[:：]\s*([^\n]+)/g;
    const titlePattern = /标题[:：]\s*([^\n]+)/g;
    const categoryPattern = /类别[:：]\s*([^\n]+)/g;
    const descriptionPattern = /描述[:：]\s*([^\n]+)/g;
    const imagePattern = /图片[:：]\s*([^\n]+)/g;
    const problemPattern = /问题[:：]\s*([^\n]+)/g;
    const insightPattern = /洞察[:：]\s*([^\n]+)/g;
    const solutionPattern = /解决方案[:：]\s*([^\n]+)/g;

    // 提取所有项目
    const projects = [];
    let match;

    // 假设PDF中有6个项目
    for (let i = 1; i <= 6; i++) {
      const project = {
        id: '',
        title: '',
        category: '',
        description: '',
        image: '',
        problem: '',
        insight: '',
        solution: '',
        process: []
      };

      // 提取项目ID
      const idMatch = text.match(new RegExp(`项目${i}[:：]`));
      if (idMatch) {
        project.id = idMatch[0].replace(/[：:]/g, '').trim();
      }

      // 提取标题
      const titleMatch = text.match(new RegExp(`项目${i}[:：][^\\n]*\\n标题[:：]([^\\n]+)`));
      if (titleMatch) {
        project.title = titleMatch[1].trim();
      }

      // 提取类别
      const categoryMatch = text.match(new RegExp(`类别[:：]([^\\n]+)`));
      if (categoryMatch) {
        project.category = categoryMatch[1].trim();
      }

      // 提取描述
      const descMatch = text.match(new RegExp(`描述[:：]([^\\n]+)`));
      if (descMatch) {
        project.description = descMatch[1].trim();
      }

      // 提取图片路径（如果PDF中有提供）
      const imgMatch = text.match(new RegExp(`图片[:：]([^\\n]+)`));
      if (imgMatch) {
        project.image = imgMatch[1].trim();
      }

      // 提取问题
      const problemMatch = text.match(new RegExp(`问题[:：]([^\\n]+)`));
      if (problemMatch) {
        project.problem = problemMatch[1].trim();
      }

      // 提取洞察
      const insightMatch = text.match(new RegExp(`洞察[:：]([^\\n]+)`));
      if (insightMatch) {
        project.insight = insightMatch[1].trim();
      }

      // 提取解决方案
      const solutionMatch = text.match(new RegExp(`解决方案[:：]([^\\n]+)`));
      if (solutionMatch) {
        project.solution = solutionMatch[1].trim();
      }

      // 生成设计过程（如果PDF中没有提供，则创建）
      project.process = [
        { step: "01", title: "研究", desc: "深入了解用户需求和市场需求分析" },
        { step: "02", title: "概念", desc: "基于洞察创建创新设计方案" },
        { step: "03", title: "原型", desc: "制作高保真交互原型进行测试" },
        { step: "04", title: "测试", desc: "用户测试和迭代优化设计" }
      ];

      // 如果没有提供图片，使用占位符
      if (!project.image) {
        project.image = `https://picsum.photos/seed/${project.id}/800/600.jpg`;
      }

      projects.push(project);
    }

    this.projects = projects;
    return projects;
  }

  // 获取项目数据
  getProjects() {
    return this.projects;
  }

  // 导出为JSON
  toJSON() {
    return JSON.stringify(this.projects, null, 2);
  }
}

// ==================== CONTENT UPDATER ====================
class ContentUpdater {
  constructor(pdfExtractor) {
    this.pdfExtractor = pdfExtractor;
    this.dataFile = 'assets/projects-data.json';
  }

  // 更新index.html
  updateIndexHTML() {
    const projects = this.pdfExtractor.getProjects();
    let html = '';

    projects.forEach(project => {
      html += `
        <!-- Project ${project.id} -->
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
      `;
    });

    // 读取当前index.html
    return fetch('index.html')
      .then(response => response.text())
      .then(content => {
        // 替换works section内容
        const worksSectionRegex = /<section class="works" id="works">[\s\S]*?<div class="works-container">([\s\S]*?)<\/div><\/section>/;
        const updatedContent = content.replace(worksSectionRegex,
          `<section class="works" id="works">
            <div class="works-container">
${html}
            </div>
          </section>`
        );

        return updatedContent;
      });
  }

  // 更新project.html
  updateProjectHTML() {
    const projects = this.pdfExtractor.getProjects();
    let projectHTMLs = {};

    projects.forEach(project => {
      let html = `
        <!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title} - Case Study</title>
  <link rel="stylesheet" href="assets/styles.css">
  <link rel="stylesheet" href="assets/project-styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=PP+Editorial+New:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body class="project-page">
  <!-- NAVIGATION -->
  <nav class="nav-main">
    <div class="nav-container">
      <a href="index.html" class="nav-link">← Portfolio</a>
    </div>
  </nav>

  <!-- SCROLL-DRIVEN SECTIONS -->

  <!-- HERO SECTION -->
  <section class="case-hero" data-section="hero">
    <div class="case-content">
      <h1 id="projectTitle">${project.title}</h1>
      <h2 id="projectSubtitle">${project.category}</h2>
      <img id="projectHeroImage" src="${project.image}" alt="${project.title} hero image" class="project-image">
    </div>
  </section>

  <!-- PROBLEM SECTION -->
  <section class="case-section" data-section="problem">
    <div class="case-content">
      <h2>Problem Statement</h2>
      <div id="problemContent" class="case-text">
        <p>${project.problem}</p>
      </div>
    </div>
  </section>

  <!-- INSIGHT SECTION -->
  <section class="case-section" data-section="insight">
    <div class="case-content">
      <h2>Key Insights</h2>
      <div id="insightContent" class="case-text">
        <p>${project.insight}</p>
      </div>
    </div>
  </section>

  <!-- PROCESS TIMELINE -->
  <section class="case-section timeline" data-section="process">
    <div class="case-content">
      <h2>Design Process</h2>
      <div class="timeline-container">
        ${project.process.map(step => `
          <div class="timeline-item">
            <div class="timeline-marker">${step.step}</div>
            <div class="timeline-content">
              <h3>${step.title}</h3>
              <p>${step.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FINAL RESULT SECTION -->
  <section class="case-section" data-section="final">
    <div class="case-content">
      <h2>Final Solution</h2>
      <div id="finalContent">
        <img id="finalResultImage" src="${project.image}" alt="Final design result" class="project-image">
        <div class="final-description">
          <p>${project.solution}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- REFLECTION SECTION -->
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
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('id');

      if (projectId === '${project.id}') {
        document.title = '${project.title} - Case Study';
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
</html>
      `;

      projectHTMLs[project.id] = html;
    });

    return projectHTMLs;
  }

  // 保存数据文件
  saveDataFile() {
    const data = {
      lastUpdated: new Date().toISOString(),
      projects: this.pdfExtractor.getProjects()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// ==================== PDF UPLOAD HANDLER ====================
class PDFUploadHandler {
  constructor() {
    this.extractor = new PDFExtractor();
    this.updater = new ContentUpdater(this.extractor);
    this.init();
  }

  init() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.id = 'pdf-upload';
    fileInput.style.display = 'none';

    const label = document.createElement('label');
    label.htmlFor = 'pdf-upload';
    label.textContent = 'Upload PDF to Update Portfolio';
    label.style.cssText = `
      display: inline-block;
      padding: 12px 24px;
      background: #FF2A2A;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    label.addEventListener('mouseenter', () => {
      label.style.background = '#CC0000';
      label.style.transform = 'translateY(-2px)';
    });

    label.addEventListener('mouseleave', () => {
      label.style.background = '#FF2A2A';
      label.style.transform = 'translateY(0)';
    });

    document.body.appendChild(fileInput);
    document.body.appendChild(label);

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.handlePDFUpload(file);
      } else {
        alert('Please select a valid PDF file');
      }
    });
  }

  async handlePDFUpload(file) {
    console.log('Processing PDF...', file.name);

    try {
      // 显示加载状态
      const status = document.createElement('div');
      status.id = 'upload-status';
      status.textContent = 'Extracting content from PDF...';
      status.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: #333;
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      document.body.appendChild(status);

      // 提取PDF内容
      const projects = await this.extractor.readPDF(file);

      // 更新内容
      const updatedIndex = await this.updater.updateIndexHTML();
      const projectHTMLs = this.updater.updateProjectHTML();

      // 显示成功消息
      status.textContent = `Successfully extracted ${projects.length} projects!`;
      status.style.background = '#4CAF50';

      // 保存数据文件
      this.updater.saveDataFile();

      // 3秒后移除状态
      setTimeout(() => {
        status.remove();
        alert('Portfolio updated successfully! Download the data file and update your HTML files.');
      }, 3000);

    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please check the console for details.');
    }
  }
}

// 初始化
if (typeof document !== 'undefined') {
  const uploadHandler = new PDFUploadHandler();
}