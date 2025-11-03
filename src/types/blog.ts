// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: 'CTF' | 'Flipper Zero';
  subcategory?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  excerpt?: string;
  slug: string;
  images?: string[];
}

export interface PostsData {
  posts: BlogPost[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
}

// Subcategories for each main category
export const SUBCATEGORIES = {
  CTF: ['HTB Season 9', 'Hack The Boo 2025', 'OSCP Practice'],
  'Flipper Zero': ['Sub-GHz Analysis', 'NFC/RFID', 'Hardware Hacking', 'GPIO Projects']
} as const;
