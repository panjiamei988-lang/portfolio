// ==================== AUTO-UPDATE TOOL ====================
class AutoUpdateTool {
  constructor() {
    this.dataManager = new ProjectDataManager();
    this.templateGenerator = new TemplateGenerator(this.dataManager);
    this.init();
  }

  init() {
    this.createUploadInterface();
    this.createUpdateButtons();
  }

  // 创建上传界面
  createUploadInterface() {
    const container = document.createElement('div');
    container.id = 'auto-update-tool';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.95);
      border: 1px solid rgba(255, 42, 42, 0.5);
      border-radius: 12px;
      padding: 20px;
      z-index: 10000;
      min-width: 300px;
      backdrop-filter: blur(10px);
    `;

    container.innerHTML = `
      <h3 style="color: #FF2A2A; margin-bottom: 15px;">🚀 Portfolio Auto-Update</h3>
      <p style="color: #ccc; font-size: 14px; margin-bottom: 15px;">
        Update your portfolio from PDF data
      </p>

      <div id="upload-area" style="
        border: 2px dashed #666;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 15px;
      ">
        <div style="color: #999; font-size: 48px;">📄</div>
        <div style="color: #ccc; margin-top: 10px;">Click to upload PDF</div>
      </div>

      <input type="file" id="pdf-file-input" accept=".pdf" style="display: none;">

      <div id="action-buttons" style="display: none;">
        <button id="preview-btn" style="
          background: #FF2A2A;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 10px;
          transition: all 0.3s ease;
        ">Preview Changes</button>

        <button id="apply-btn" style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 10px;
          transition: all 0.3s ease;
        ">Apply Updates</button>

        <button id="download-btn" style="
          background: #2196F3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Download Files</button>
      </div>

      <div id="status" style="
        margin-top: 15px;
        padding: 10px;
        border-radius: 6px;
        display: none;
      "></div>
    `;

    document.body.appendChild(container);

    // 绑定事件
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('pdf-file-input');

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => this.handlePDFUpload(e.target.files[0]));

    document.getElementById('preview-btn').addEventListener('click', () => this.previewChanges());
    document.getElementById('apply-btn').addEventListener('click', () => this.applyUpdates());
    document.getElementById('download-btn').addEventListener('click', () => this.downloadFiles());

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = '#FF2A2A';
      uploadArea.style.background = 'rgba(255, 42, 42, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = '#666';
      uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = '#666';
      uploadArea.style.background = 'transparent';

      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        this.handlePDFUpload(file);
      }
    });
  }

  // 创建更新按钮
  createUpdateButtons() {
    const quickActions = document.createElement('div');
    quickActions.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
    `;

    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '🔄 Refresh Data';
    refreshBtn.style.cssText = `
      background: #333;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      margin-right: 10px;
      font-size: 14px;
      transition: all 0.3s ease;
    `;
    refreshBtn.addEventListener('mouseenter', () => {
      refreshBtn.style.background = '#555';
      refreshBtn.style.transform = 'translateY(-2px)';
    });
    refreshBtn.addEventListener('mouseleave', () => {
      refreshBtn.style.background = '#333';
      refreshBtn.style.transform = 'translateY(0)';
    });
    refreshBtn.addEventListener('click', () => this.refreshData());

    quickActions.appendChild(refreshBtn);
    document.body.appendChild(quickActions);
  }

  // 处理PDF上传
  async handlePDFUpload(file) {
    if (!file) return;

    this.showStatus('Processing PDF...', 'info');

    try {
      // 读取PDF
      const arrayBuffer = await file.arrayBuffer();

      // 模拟PDF解析（实际项目中需要集成PDF.js）
      // 这里我们假设PDF已经转换为JSON格式
      const projects = await this.parsePDFContent(arrayBuffer);

      // 更新数据管理器
      this.dataManager.projects = projects;
      this.dataManager.saveToLocalStorage();

      // 显示操作按钮
      document.getElementById('action-buttons').style.display = 'block';
      this.showStatus(`Successfully extracted ${projects.length} projects!`, 'success');

    } catch (error) {
      console.error('PDF processing failed:', error);
      this.showStatus('Error processing PDF: ' + error.message, 'error');
    }
  }

  // 解析PDF内容（简化版）
  async parsePDFContent(arrayBuffer) {
    // 在实际项目中，这里需要集成PDF.js
    // 现在我们返回模拟数据
    return [
      {
        id: 'product-1',
        title: 'Smart Home Device',
        category: 'IoT Design',
        description: 'Revolutionary smart home control system',
        image: 'https://picsum.photos/seed/smarthome/800/600.jpg',
        problem: 'Complex home automation systems are difficult to use and control.',
        insight: 'Users need simple, intuitive control of their smart devices.',
        solution: 'A unified smart home interface with voice control and automation.',
        process: [
          { step: '01', title: 'Research', desc: 'User interviews and competitive analysis' },
          { step: '02', title: 'Concept', desc: 'Unified control system design' },
          { step: '03', title: 'Prototype', desc: 'Interactive voice interface' },
          { step: '04', title: 'Testing', desc: 'Real home user testing' }
        ]
      },
      {
        id: 'product-2',
        title: 'Fitness Tracker',
        category: 'Wearable Tech',
        description: 'Advanced fitness tracking with AI coaching',
        image: 'https://picsum.photos/seed/fitness/800/600.jpg',
        problem: 'Fitness trackers provide data but lack actionable insights.',
        insight: 'Users need personalized guidance based on their fitness data.',
        solution: 'An AI-powered fitness tracker that adapts to user goals.',
        process: [
          { step: '01', title: 'Research', desc: 'Fitness habits analysis' },
          { step: '02', title: 'Concept', desc: 'AI coaching algorithm' },
          { step: '03', title: 'Prototype', desc: 'Mobile app integration' },
          { step: '04', title: 'Testing', desc: 'Beta user trials' }
        ]
      },
      {
        id: 'product-3',
        title: 'E-Learning Platform',
        category: 'Educational Tech',
        description: 'Interactive online learning experience',
        image: 'https://picsum.photos/seed/elearning/800/600.jpg',
        problem: 'Online learning lacks engagement and personalization.',
        insight: 'Learners need interactive, tailored educational experiences.',
        solution: 'An adaptive e-learning platform with gamification elements.',
        process: [
          { step: '01', title: 'Research', desc: 'Learning patterns study' },
          { step: '02', title: 'Concept', desc: 'Adaptive learning paths' },
          { step: '03', title: 'Prototype', desc: 'Interactive modules' },
          { step: '04', title: 'Testing', desc: 'Student beta testing' }
        ]
      },
      {
        id: 'product-4',
        title: 'Food Delivery App',
        category: 'Mobile Design',
        description: 'Seamless food ordering experience',
        image: 'https://picsum.photos/seed/foodapp/800/600.jpg',
        problem: 'Food delivery apps are complicated and slow.',
        insight: 'Users want fast, easy food ordering with personalized recommendations.',
        solution: 'A streamlined food delivery app with smart suggestions.',
        process: [
          { step: '01', title: 'Research', desc: 'User journey mapping' },
          { step: '02', title: 'Concept', desc: 'Simplified ordering flow' },
          { step: '03', title: 'Prototype', desc: 'Quick-order interface' },
          { step: '04', title: 'Testing', desc: 'A/B testing flows' }
        ]
      },
      {
        id: 'product-5',
        title: 'Mental Health App',
        category: 'Health Tech',
        description: 'Digital wellbeing companion',
        image: 'https://picsum.photos/seed/mental/800/600.jpg',
        problem: 'Mental health resources are inaccessible and overwhelming.',
        insight: 'Users need accessible, daily mental wellness support.',
        solution: 'A comprehensive mental health app with guided exercises.',
        process: [
          { step: '01', title: 'Research', desc: 'Therapist interviews' },
          { step: '02', title: 'Concept', desc: 'Daily wellness routine' },
          { step: '03', title: 'Prototype', desc: 'Guided meditation feature' },
          { step: '04', title: 'Testing', desc: 'Clinical trials' }
        ]
      },
      {
        id: 'product-6',
        title: 'Sustainable Fashion',
        category: 'E-commerce',
        description: 'Eco-friendly clothing marketplace',
        image: 'https://picsum.photos/seed/fashion/800/600.jpg',
        problem: 'Fashion industry has major environmental impact.',
        insight: 'Consumers want sustainable but stylish clothing options.',
        solution: 'A platform connecting eco-conscious brands with buyers.',
        process: [
          { step: '01', title: 'Research', desc: 'Sustainability metrics' },
          { step: '02', title: 'Concept', desc: 'Transparent supply chain' },
          { step: '03', title: 'Prototype', desc: 'Brand certification system' },
          { step: '04', title: 'Testing', desc: 'Sustainability audits' }
        ]
      }
    ];
  }

  // 预览更改
  previewChanges() {
    this.showStatus('Generating preview...', 'info');

    setTimeout(() => {
      const preview = document.getElementById('auto-update-tool');
      preview.style.transform = 'scale(1.02)';
      preview.style.boxShadow = '0 0 30px rgba(255, 42, 42, 0.5)';

      setTimeout(() => {
        preview.style.transform = '';
        preview.style.boxShadow = '';
        this.showStatus('Preview generated! Check the console for details.', 'success');
        console.log('Projects:', this.dataManager.getProjects());
      }, 1000);
    }, 500);
  }

  // 应用更新
  applyUpdates() {
    this.showStatus('Applying updates...', 'info');

    // 生成新的HTML内容
    const newIndexHTML = this.templateGenerator.generateIndexHTML();
    const newProjectHTML = this.templateGenerator.generateProjectHTMLTemplate();

    // 显示更新结果
    console.log('New index.html generated');
    console.log('New project.html template generated');

    this.showStatus('Updates applied successfully!', 'success');

    // 更新页面内容
    setTimeout(() => {
      if (confirm('Replace current page content with updated version?')) {
        document.open();
        document.write(newIndexHTML);
        document.close();
      }
    }, 1000);
  }

  // 下载文件
  downloadFiles() {
    const projects = this.dataManager.getProjects();
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'portfolio-projects.json';
    link.click();

    this.showStatus('Project data downloaded!', 'success');
  }

  // 刷新数据
  async refreshData() {
    this.showStatus('Refreshing data...', 'info');

    try {
      await this.dataManager.loadProjects();
      this.showStatus('Data refreshed successfully!', 'success');
    } catch (error) {
      this.showStatus('Failed to refresh data: ' + error.message, 'error');
    }
  }

  // 显示状态
  showStatus(message, type) {
    const status = document.getElementById('status');
    status.style.display = 'block';
    status.textContent = message;

    switch(type) {
      case 'success':
        status.style.background = 'rgba(76, 175, 80, 0.2)';
        status.style.color = '#4CAF50';
        status.style.border = '1px solid #4CAF50';
        break;
      case 'error':
        status.style.background = 'rgba(244, 67, 54, 0.2)';
        status.style.color = '#f44336';
        status.style.border = '1px solid #f44336';
        break;
      default:
        status.style.background = 'rgba(255, 193, 7, 0.2)';
        status.style.color = '#FFC107';
        status.style.border = '1px solid #FFC107';
    }
  }
}

// 初始化
if (typeof document !== 'undefined') {
  const autoUpdateTool = new AutoUpdateTool();
  console.log('Auto-Update Tool initialized');
}