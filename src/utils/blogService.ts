import { BlogPost, PostsData } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const POSTS_FILE_PATH = path.join(process.cwd(), 'src/data/posts.json');

// Initialize posts data structure if it doesn't exist
const initializePostsFile = () => {
  if (!fs.existsSync(POSTS_FILE_PATH)) {
    const initialData: PostsData = {
      posts: [
        {
          id: uuidv4(),
          title: "Getting Started with HTB Season 9",
          content: "<h1>HTB Season 9 Journey</h1><p>This is my writeup for participating in HackTheBox Season 9...</p><h2>Initial Setup</h2><p>First, I prepared my environment...</p>",
          category: "CTF",
          subcategory: "HTB Season 9",
          tags: ["HTB Season 9", "Windows", "Active Directory"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          published: true,
          excerpt: "My journey and learnings from HTB Season 9 competition",
          slug: "getting-started-htb-season-9",
          images: []
        },
        {
          id: uuidv4(),
          title: "OSCP Preparation Strategy",
          content: "<h1>OSCP Preparation Guide</h1><p>After months of preparation, here's my strategy for OSCP...</p><h2>Study Plan</h2><ol><li>Theory Foundation</li><li>Practical Labs</li><li>Mock Exams</li></ol>",
          category: "CTF",
          subcategory: "OSCP Practice",
          tags: ["OSCP", "Certification", "Penetration Testing"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          published: true,
          excerpt: "A comprehensive guide to preparing for the OSCP certification",
          slug: "oscp-preparation-strategy",
          images: []
        }
      ]
    };
    fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(initialData, null, 2));
  }
};

// Get all posts
export const getAllPosts = (): BlogPost[] => {
  initializePostsFile();
  const data = fs.readFileSync(POSTS_FILE_PATH, 'utf8');
  const postsData: PostsData = JSON.parse(data);
  return postsData.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get posts by category
export const getPostsByCategory = (category: 'CTF' | 'Flipper Zero'): BlogPost[] => {
  return getAllPosts().filter(post => post.category === category && post.published);
};

// Get posts by subcategory
export const getPostsBySubcategory = (category: 'CTF' | 'Flipper Zero', subcategory: string): BlogPost[] => {
  return getAllPosts().filter(post => 
    post.category === category && 
    post.subcategory === subcategory && 
    post.published
  );
};

// Get posts by tag
export const getPostsByTag = (tag: string): BlogPost[] => {
  return getAllPosts().filter(post => post.tags.includes(tag) && post.published);
};

// Get post by ID
export const getPostById = (id: string): BlogPost | null => {
  const posts = getAllPosts();
  return posts.find(post => post.id === id) || null;
};

// Get post by slug
export const getPostBySlug = (slug: string): BlogPost | null => {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
};

// Create new post
export const createPost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost => {
  initializePostsFile();
  const data = fs.readFileSync(POSTS_FILE_PATH, 'utf8');
  const postsData: PostsData = JSON.parse(data);
  
  const newPost: BlogPost = {
    ...postData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: postData.images || [],
  };
  
  postsData.posts.push(newPost);
  fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(postsData, null, 2));
  
  return newPost;
};

// Update post
export const updatePost = (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): BlogPost | null => {
  initializePostsFile();
  const data = fs.readFileSync(POSTS_FILE_PATH, 'utf8');
  const postsData: PostsData = JSON.parse(data);
  
  const postIndex = postsData.posts.findIndex(post => post.id === id);
  if (postIndex === -1) return null;
  
  postsData.posts[postIndex] = {
    ...postsData.posts[postIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(postsData, null, 2));
  
  return postsData.posts[postIndex];
};

// Delete post
export const deletePost = (id: string): boolean => {
  initializePostsFile();
  const data = fs.readFileSync(POSTS_FILE_PATH, 'utf8');
  const postsData: PostsData = JSON.parse(data);
  
  const postIndex = postsData.posts.findIndex(post => post.id === id);
  if (postIndex === -1) return false;
  
  postsData.posts.splice(postIndex, 1);
  fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(postsData, null, 2));
  
  return true;
};

// Get all unique tags
export const getAllTags = (): string[] => {
  const posts = getAllPosts();
  const allTags = posts.flatMap(post => post.tags);
  return Array.from(new Set(allTags)).sort();
};
