# 🎨 设计作品集 Portfolio

一个极简主义风格的综合设计作品集网站，包含UI/UX设计和平面设计作品展示。

## ✨ 特点

- 📐 **极简主义设计** - 大量留白，简洁排版，现代感十足
- 📱 **完全响应式** - 适配桌面、平板和移动设备
- ⚡ **纯静态页面** - 使用HTML/CSS/JavaScript构建，易于部署
- 🎯 **流畅交互** - 平滑滚动和滚动动画效果
- 🖼️ **作品展示** - 清晰的作品分类展示

## 🚀 技术栈

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- JavaScript (ES6+)
- Google Fonts (Noto Sans SC)

## 📦 项目结构

```
portfolio/
├── assets/
│   ├── images/       # 图片资源
│   ├── icons/        # 图标资源
│   ├── styles.css    # 主要样式文件
│   └── script.js     # 交互脚本
├── content/          # 作品内容
│   ├── ui-ux/        # UI/UX设计作品
│   ├── graphic-design/ # 平面设计作品
│   ├── about/        # 关于信息
│   └── resume/       # 简历信息
├── index.html        # 主页文件
├── README.md         # 项目说明
└── .gitignore        # Git忽略文件
```

## 🛠️ 安装与使用

1. 克隆或下载项目到本地

2. 打开 `index.html` 文件即可在浏览器中预览

```bash
# 推荐使用本地服务器查看
python -m http.server 8000
# 或
npx serve
```

3. 在浏览器中访问 `http://localhost:8000`

## 🎨 自定义配置

### 修改颜色主题

在 `assets/styles.css` 文件中修改 CSS 变量：

```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f8f8;
    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --accent: #1a1a1a;
}
```

### 替换图片

将 `assets/images/` 目录中的图片替换为你自己的作品图片。

### 添加更多作品

在 `index.html` 中复制 `work-item` 结构并修改内容：

```html
<article class="work-item">
    <div class="work-image">
        <div class="placeholder">作品图片</div>
    </div>
    <div class="work-content">
        <span class="work-category">分类</span>
        <h3 class="work-title">作品标题</h3>
        <p class="work-description">作品描述</p>
    </div>
</article>
```

## 📄 许可证

MIT License

## 👤 作者

设计师姓名

## 📧 联系方式

- Email: hello@portfolio.com
- Location: 中国 · 北京

---

*设计创造价值 ✨*
