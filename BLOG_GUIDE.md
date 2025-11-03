# 📖 Blog Management Guide

## 🔐 Admin Access

### Login Credentials
- **Username**: `rafael-root`
- **Password**: `123456`
- **Access**: http://localhost:3089/posts

### Login Process
1. Navigate to Posts page
2. Click "Create New Post" or edit button
3. Login modal will appear
4. Enter credentials to access admin features

---

## ✏️ Creating Posts

### Post Creation Steps
1. **Login** as admin (see above)
2. Click **"Create New Post"** button
3. Fill in the form:
   - **Title**: Your post title
   - **Category**: Choose CTF or Flipper Zero
   - **Subcategory**: Select appropriate subcategory
   - **Excerpt**: Brief description for preview
   - **Content**: Use rich text editor for full content
   - **Tags**: Comma-separated tags
   - **Published**: Toggle to make post live

### Rich Text Editor Features
- **Formatting**: Bold, italic, underline, strikethrough
- **Headers**: H1, H2, H3 for structure
- **Lists**: Bullet points and numbered lists
- **Code**: Inline code and code blocks with syntax highlighting
- **Links**: Add hyperlinks to external resources
- **Images**: Insert images via URL
- **Quotes**: Blockquotes for emphasis

### Content Tips
- Use **code blocks** for command examples
- Add **headers** to structure your writeups
- Include **images** for screenshots and diagrams  
- Use **lists** for step-by-step instructions
- Add **links** to reference materials

---

## 📝 Content Categories

### CTF Category
**Subcategories**:
- **HTB Season 9**: Hack The Box seasonal challenges
- **Hack The Boo 2025**: Halloween-themed CTF challenges
- **OSCP Practice**: Offensive Security practice exercises

**Content Ideas**:
- Challenge writeups with detailed solutions
- Methodology explanations
- Tool usage examples
- Learning takeaways

### Flipper Zero Category  
**Subcategories**:
- **Hardware Hacking**: Physical device manipulation
- **Custom Payloads**: Badger development
- **Badge Development**: Hardware badge creation

**Content Ideas**:
- Hardware modification tutorials
- Custom firmware development
- Badge design and programming
- Hardware security research

---

## 🎨 Formatting Examples

### Code Block Example
```bash
# Nmap scan example
nmap -sC -sV -oA scan target_ip
```

### Header Structure
```markdown
# Main Title
## Section Header  
### Subsection
```

### Lists and Links
- **Bullet points** for features
- [External links](https://example.com) for references
- `Inline code` for commands

---

## 🔄 Managing Existing Posts

### Edit Posts
1. Login as admin
2. Click edit button on any post card
3. Modify content in the rich text editor
4. Save changes

### Delete Posts
1. Login as admin  
2. Use delete button on post cards
3. Confirm deletion

### Publishing Control
- **Published**: Post visible to all visitors
- **Unpublished**: Post only visible to admin (draft mode)

---

## 💡 Content Strategy Tips

### For CTF Writeups
1. **Challenge Description**: What was the goal?
2. **Initial Reconnaissance**: What did you discover?
3. **Exploitation Steps**: Detailed walkthrough
4. **Code/Commands**: Include all commands used
5. **Lessons Learned**: Key takeaways

### For Hardware Posts
1. **Hardware Overview**: Device specifications
2. **Tools Required**: List necessary equipment  
3. **Step-by-Step Process**: Detailed instructions
4. **Code Examples**: Include any custom code
5. **Results & Analysis**: What was achieved?

---

## 🚀 Publishing Workflow

### Recommended Process
1. **Draft**: Create unpublished post
2. **Review**: Check formatting and content
3. **Test**: Verify all links and images work
4. **Publish**: Toggle published status
5. **Share**: Post is now live on your portfolio

### Quality Checklist
- [ ] Title is descriptive and SEO-friendly
- [ ] Category and subcategory are correct
- [ ] Excerpt summarizes the content well
- [ ] Content is well-formatted with headers
- [ ] Code blocks use proper syntax highlighting
- [ ] Images are accessible and relevant
- [ ] Tags are relevant and helpful
- [ ] Content is proofread and professional

---

## 🔧 Technical Notes

### Image Usage
- Currently supports **image URLs** only
- Use reliable hosting (GitHub, Imgur, etc.)
- Optimize images for web (< 1MB recommended)

### Code Syntax Highlighting
Supported languages include:
- `bash`, `python`, `javascript`, `html`, `css`
- `sql`, `php`, `json`, `yaml`, `markdown`
- And many more via lowlight

### Backup Recommendations
- Export post content regularly
- Keep local copies of important writeups
- Use version control for complex posts

---

*Happy blogging! Your cybersecurity expertise deserves to be shared.* 🛡️
