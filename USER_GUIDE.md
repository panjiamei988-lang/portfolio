# 🎨 作品集网站使用指南

## 📋 项目概述

这是一个功能完整的设计作品集网站，采用数据驱动架构，支持动态内容管理、PDF导入和移动端优化。

## 🏗️ 项目结构

```
portfolio/
├── index.html              # 主页（静态版本）
├── data-driven-index.html  # 数据驱动版本（推荐）
├── admin.html              # 管理界面
├── project-template.html    # 项目详情模板
├── README.md               # 项目说明
├── USER_GUIDE.md           # 使用指南（本文件）
├── assets/                 # 资源文件夹
│   ├── styles.css          # 主样式文件
│   ├── mobile-styles.css  # 移动端样式
│   ├── script.js          # 主脚本
│   ├── data-driven-init.js # 数据驱动初始化
│   ├── project-data-manager.js # 项目数据管理
│   ├── auto-update.js     # 自动更新工具
│   ├── pdf-extractor.js   # PDF提取工具
│   ├── mobile-enhancements.js # 移动端增强
│   ├── minimal-fix.js     # 兼容性修复
│   ├── ultimate-fix.css    # 样式修复
│   ├── project-styles.css  # 项目页面样式
│   ├── projects-data.json # 项目数据
│   ├── images/            # 图片资源
│   └── icons/             # 图标资源
```

## 🚀 快速开始

### 1. 基础使用

直接在浏览器中打开 `index.html` 即可查看作品集。

```bash
# 使用本地服务器查看（推荐）
python -m http.server 8000
# 或
npx serve

# 访问 http://localhost:8000
```

### 2. 数据驱动版本

使用 `data-driven-index.html` 获得最佳体验：

```bash
# 打开数据驱动版本
open data-driven-index.html
```

### 3. 管理界面

使用 `admin.html` 管理项目内容：

```bash
# 打开管理界面
open admin.html
```

## 📊 功能特性

### 1. 数据驱动架构

- 使用 JSON 文件存储项目数据
- 支持动态加载和更新
- 本地缓存优化加载速度

### 2. PDF 导入功能

- 支持从 PDF 文档提取项目信息
- 自动生成项目页面
- 批量处理多个 PDF

### 3. 移动端优化

- 完全响应式设计
- 触摸手势支持
- 性能优化
- 下拉刷新功能

### 4. 内容管理

- 项目增删改查
- 分类管理
- 实时预览
- 数据导出

## 🛠️ 详细使用指南

### 项目数据管理

项目数据存储在 `assets/projects-data.json` 文件中：

```json
{
  "projects": [
    {
      "id": "eye-massager",
      "title": "眼部按摩仪 SynMuse",
      "category": "Wellness Design",
      "description": "以多感官疗愈重塑眼部健康",
      "image": "图片URL",
      "problem": "问题描述",
      "insight": "关键洞察",
      "solution": "解决方案",
      "technologies": ["技术1", "技术2"],
      "results": "项目结果",
      "process": [
        {
          "step": "01",
          "title": "研究",
          "desc": "用户研究描述"
        }
      ]
    }
  ]
}
```

### 管理界面使用

1. **添加项目**
   - 填写项目信息表单
   - 点击"保存项目"
   - 项目将自动添加到列表

2. **编辑项目**
   - 点击项目列表中的"编辑"按钮
   - 修改信息后保存
   - 更新将实时生效

3. **删除项目**
   - 点击"删除"按钮
   - 确认删除操作

4. **导出数据**
   - 点击"导出数据"按钮
   - 下载 JSON 格式的项目数据

### PDF 导入流程

1. **准备 PDF 文档**
   - PDF 应包含以下格式的内容：
     ```
     项目1:
     标题: 项目名称
     类别: 项目类别
     描述: 项目简介
     问题: 问题描述
     洞察: 关键洞察
     解决方案: 解决方案
     ```

2. **上传 PDF**
   - 在数据驱动页面点击右上角的 "PDF 提取" 按钮
   - 选择 PDF 文件
   - 等待提取完成

3. **应用更新**
   - 提取成功后，点击"应用更新"
   - 确认替换当前内容

### 移动端功能

1. **手势操作**
   - 左滑：查看下一个项目
   - 右滑：查看上一个项目
   - 下拉：刷新内容

2. **性能优化**
   - 懒加载图片
   - 减少动画效果
   - 优化触摸响应

3. **特色功能**
   - 摇晃设备激活隐藏功能
   - 下拉刷新
   - 触摸友好的交互

## 🎨 自定义配置

### 修改主题颜色

在 `assets/styles.css` 中修改 CSS 变量：

```css
:root {
  --color-bg-primary: #000000;
  --color-bg-secondary: #0A0000;
  --color-text-primary: #FFFFFF;
  --color-accent-primary: #FF2A2A;
}
```

### 添加新项目

1. 在 `assets/projects-data.json` 中添加新项目
2. 或通过管理界面添加
3. 更新页面内容

### 自定义样式

1. 修改 `assets/styles.css`
2. 或创建新的样式文件
3. 在 HTML 中引入

## 📱 部署指南

### GitHub Pages 部署

1. 创建 GitHub 仓库
2. 上传所有文件
3. 开启 GitHub Pages
4. 访问生成的 URL

### 自定义域名

1. 在 GitHub 仓库设置中添加自定义域名
2. 配置 DNS
3. 等待生效

## 🔧 故障排除

### 常见问题

1. **页面无法加载**
   - 检查文件路径是否正确
   - 确保所有资源文件存在

2. **PDF 提取失败**
   - 确保 PDF 文件格式正确
   - 检查 PDF 内容是否符合预期格式

3. **移动端显示问题**
   - 检查 viewport 设置
   - 确保移动端样式已加载

4. **数据不更新**
   - 清除浏览器缓存
   - 检查 localStorage 中的数据

### 性能优化

1. 图片压缩
   - 使用 WebP 格式
   - 实现懒加载

2. 代码优化
   - 压缩 CSS 和 JavaScript
   - 使用 CDN 加速资源

## 📞 联系支持

如有问题，请通过以下方式联系：

- Email: 3303953515@qq.com
- Phone: 15867819664

---

**版本信息**
- 当前版本: 1.0
- 最后更新: 2026-06-17
- 作者: 盘家美