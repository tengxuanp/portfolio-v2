# 🛡️ Cybersecurity Portfolio - Usage Guide

## 🚀 Quick Start

### Method 1: Simple Launch
```bash
./start-portfolio.sh
```

### Method 2: Manual Start
```bash
npm run dev
```

Visit: **http://localhost:3089**

## 🔐 Admin Access

**Credentials:**
- Username: `rafael-root`
- Password: `123456`

**Features Available:**
- Create, edit, delete blog posts
- Upload multiple images per post
- Manage drafts and published content
- Rich text formatting with code syntax highlighting

## 📝 Creating Cybersecurity Content

### 1. CTF Writeups

**Path:** Home → CTF Writeups → Login → Create New Post

**Subcategories:**
- HTB Season 9
- Hack The Boo 2025
- OSCP Practice

**Content Ideas:**
- Machine walkthroughs with screenshots
- Tool usage and command outputs
- Network diagrams and attack paths
- Code snippets with syntax highlighting

### 2. Flipper Zero Projects

**Path:** Home → Flipper Zero → Login → Create New Post

**Subcategories:**
- Hardware Hacking
- Custom Payloads
- Badge Development

**Content Ideas:**
- Hardware teardown photos
- Circuit diagrams and schematics
- Code for custom applications
- RF analysis screenshots

## 🎨 Rich Text Editor Guide

### Formatting Options
- **Headers:** H1, H2, H3 for organizing content
- **Text Styles:** Bold, italic, code inline
- **Lists:** Bullet points and numbered lists
- **Code Blocks:** Multi-language syntax highlighting
- **Links:** Auto-detection and manual insertion
- **Images:** Multi-upload with drag & drop

### Code Block Languages Supported
```bash
# Bash/Shell commands
nmap -sC -sV 10.10.10.1
```

```python
# Python exploits
import socket
s = socket.socket()
```

```powershell
# PowerShell commands
Get-ADUser -Filter *
```

```javascript
// JavaScript payloads
fetch('/api/exploit')
```

### Image Upload Workflow
1. Click the image icon in editor toolbar
2. Choose "Upload New Images" tab
3. Drag & drop multiple files or click to browse
4. Wait for upload completion
5. Click on any image to insert at cursor position

## 📊 Content Organization

### Post Structure Best Practices

```markdown
# Title: Descriptive and SEO-friendly

## Overview
Brief description of what you accomplished

## Environment Setup
Tools and machines used

## Methodology
Step-by-step approach

## Exploitation
Detailed attack chain with screenshots

## Post-Exploitation  
Privilege escalation and persistence

## Lessons Learned
Key takeaways and improvements

## Conclusion
Summary and next steps
```

### Image Organization
- Upload screenshots as you progress
- Name files descriptively (e.g., "nmap-scan-results.png")
- Include network diagrams where relevant
- Show before/after states for privilege escalation

## 🎯 Content Categories Guide

### CTF Writeups
- **HTB Season 9**: Current season machines and challenges
- **Hack The Boo 2025**: Halloween-themed security challenges  
- **OSCP Practice**: Preparation materials and practice machines

### Flipper Zero Projects
- **Hardware Hacking**: Physical security assessments
- **Custom Payloads**: BadUSB and RF attacks
- **Badge Development**: Custom firmware and applications

## 🔍 SEO and Professional Tips

### Post Titles
- Include target name: "HTB Writeup: Machine Name"
- Add difficulty: "OSCP-Style: Easy/Medium/Hard"
- Mention techniques: "Active Directory Attacks on..."

### Tags Usage
- Use specific tool names (Bloodhound, Impacket, etc.)
- Include attack techniques (Kerberoasting, etc.)
- Add difficulty indicators
- Reference frameworks (MITRE ATT&CK, etc.)

### Professional Presentation
- Always include disclaimers about ethical hacking
- Provide educational context
- Reference official documentation
- Credit original researchers and tools

## 🛠️ Technical Maintenance

### Adding New Categories
Edit `/src/types/blog.ts` to add new subcategories:

```typescript
export const SUBCATEGORIES = {
  CTF: ["HTB Season 9", "Hack The Boo 2025", "OSCP Practice", "NEW_CATEGORY"],
  "Flipper Zero": ["Hardware Hacking", "Custom Payloads", "Badge Development"]
};
```

### Backing Up Content
```bash
# Backup posts data
cp src/data/posts.json backup-posts-$(date +%Y%m%d).json

# Backup uploads
tar -czf backup-uploads-$(date +%Y%m%d).tar.gz public/uploads/
```

### Deployment Preparation
1. Change admin password in `.env.local`
2. Set secure `NEXTAUTH_SECRET`
3. Update `NEXTAUTH_URL` for production
4. Test all functionality
5. Build production version: `npm run build`

## 📈 Growth Strategy

### Content Pipeline
1. **Document as you learn** - Create posts during CTF events
2. **Screenshot everything** - Capture terminal outputs, web interfaces
3. **Explain your thought process** - Help others learn from your methodology
4. **Link between posts** - Create a knowledge base effect

### Community Engagement
- Share posts on Twitter with relevant hashtags
- Submit to CTF writeup collections
- Engage with cybersecurity communities
- Contribute to open-source security tools

## 🎉 You're Ready!

Your cybersecurity portfolio system is now complete with:
- ✅ Professional presentation focused on cybersecurity
- ✅ Organized content management with categories
- ✅ Rich text editor with image support
- ✅ Authentication-protected admin features
- ✅ Mobile-responsive design
- ✅ Sample content to get started

**Start creating your cybersecurity content today!**
