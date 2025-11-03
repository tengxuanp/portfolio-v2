'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Tabs,
  Tab,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { BlogPost, SUBCATEGORIES } from '@/types/blog';
import { AuthProvider, useAuth } from './AuthContext';
import LoginModal from './LoginModal';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-default-200 rounded-lg p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-default-200 rounded mb-2"></div>
        <div className="h-32 bg-default-100 rounded"></div>
      </div>
    </div>
  )
});
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../prose.css';

const PostsManagerContent = () => {
  const { isAuthenticated, login } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'CTF' | 'Flipper Zero'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'CTF' as 'CTF' | 'Flipper Zero',
    subcategory: '',
    tags: '',
    published: false,
    excerpt: '',
    slug: '',
  });

  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onOpenChange: onPostModalOpenChange } = useDisclosure();
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onOpenChange: onCreateModalOpenChange } = useDisclosure();
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onOpenChange: onLoginModalOpenChange } = useDisclosure();

  const searchParams = useSearchParams();

  // Predefined tags for different categories
  const ctfTags = ['Active Directory', 'Windows', 'Linux', 'HTB Season 9', 'OSCP', 'Web Exploitation', 'Binary Exploitation', 'Reverse Engineering', 'Forensics', 'Cryptography', 'Hack The Boo 2025'];
  const flipperTags = ['Sub-GHz Analysis', 'NFC', 'RFID', 'Hardware Hacking', 'GPIO', 'Infrared', 'BadUSB', '125kHz', '13.56MHz', 'iButton'];

  useEffect(() => {
    fetchPosts();
    // Handle URL parameters for category filtering
    const categoryParam = searchParams?.get('category');
    if (categoryParam === 'ctf') {
      setSelectedCategory('CTF');
    } else if (categoryParam === 'flipper') {
      setSelectedCategory('Flipper Zero');
    }
  }, [searchParams]);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, selectedSubcategory]);

  const filterPosts = () => {
    // Show all posts to admin users, only published posts to regular users
    let filtered = isAuthenticated ? posts : posts.filter(post => post.published);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (selectedSubcategory !== 'all' && selectedSubcategory) {
      filtered = filtered.filter(post => post.subcategory === selectedSubcategory);
    }
    
    setFilteredPosts(filtered);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (response.ok) {
        fetchPosts();
        onCreateModalOpenChange();
        resetForm();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          alert('Please login to create posts');
          onLoginModalOpen();
        } else {
          alert(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (response.ok) {
        fetchPosts();
        setIsEditing(false);
        onPostModalOpenChange();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          alert('Please login to edit posts');
          onLoginModalOpen();
        } else {
          alert(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
        onPostModalOpenChange();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          alert('Please login to delete posts');
          onLoginModalOpen();
        } else {
          alert(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      // Find the post to get its current data
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          published: true,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        fetchPosts();
        alert('Post published successfully!');
      } else {
        const error = await response.json();
        if (response.status === 401) {
          alert('Please login to publish posts');
          onLoginModalOpen();
        } else {
          alert(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'CTF',
      subcategory: '',
      tags: '',
      published: false,
      excerpt: '',
      slug: '',
    });
  };

  const openEditModal = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      subcategory: post.subcategory || '',
      tags: post.tags.join(', '),
      published: post.published,
      excerpt: post.excerpt || '',
      slug: post.slug,
    });
    setIsEditing(true);
    onPostModalOpen();
  };

  const openViewModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditing(false);
    onPostModalOpen();
  };

  const openCreateModal = () => {
    if (!isAuthenticated) {
      onLoginModalOpen();
      return;
    }
    resetForm();
    onCreateModalOpen();
  };

  const getCurrentTags = () => {
    return formData.category === 'CTF' ? ctfTags : flipperTags;
  };

  const addTag = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      setFormData({...formData, tags: [...currentTags, tag].join(', ')});
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading posts...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cybersecurity Blog</h1>
        <Button color="primary" onPress={openCreateModal}>
          {isAuthenticated ? 'Create New Post' : 'Login to Create Post'}
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs 
        selectedKey={selectedCategory} 
        onSelectionChange={(key) => {
          setSelectedCategory(key as 'all' | 'CTF' | 'Flipper Zero');
          setSelectedSubcategory('all');
        }}
        className="mb-4"
      >
        <Tab key="all" title="All Posts" />
        <Tab key="CTF" title="CTF Writeups" />
        <Tab key="Flipper Zero" title="Flipper Zero" />
      </Tabs>

      {/* Subcategory Filter */}
      {selectedCategory !== 'all' && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Chip
              size="sm"
              variant={selectedSubcategory === 'all' ? 'solid' : 'bordered'}
              className="cursor-pointer"
              onClick={() => setSelectedSubcategory('all')}
            >
              All {selectedCategory}
            </Chip>
            {SUBCATEGORIES[selectedCategory].map((sub) => (
              <Chip
                key={sub}
                size="sm"
                variant={selectedSubcategory === sub ? 'solid' : 'bordered'}
                className="cursor-pointer"
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex flex-col w-full">
                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary transition-colors">{post.title}</h3>
                </Link>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2">
                    <Chip size="sm" color={
                      post.category === 'CTF' ? 'success' : 
                      post.category === 'Flipper Zero' ? 'warning' : 
                      'secondary'
                    }>
                      {post.category}
                    </Chip>
                    {post.subcategory && (
                      <Chip size="sm" variant="flat">
                        {post.subcategory}
                      </Chip>
                    )}
                    {!post.published && isAuthenticated && (
                      <Chip size="sm" color="danger" variant="flat">
                        DRAFT
                      </Chip>
                    )}
                  </div>
                  <span className="text-xs text-default-500">
                    {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-sm text-default-600 mb-3 line-clamp-3">
                {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Chip key={index} size="sm" variant="flat" className="text-xs">
                    {tag}
                  </Chip>
                ))}
                {post.tags.length > 3 && (
                  <Chip size="sm" variant="flat" className="text-xs">
                    +{post.tags.length - 3}
                  </Chip>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/posts/${post.id}`}>
                  <Button size="sm" variant="light">
                    Read More
                  </Button>
                </Link>
                <Button size="sm" variant="light" onPress={() => openViewModal(post)}>
                  Quick View
                </Button>
                {isAuthenticated && (
                  <>
                    <Button size="sm" variant="light" color="warning" onPress={() => openEditModal(post)}>
                      Edit
                    </Button>
                    {!post.published && (
                      <Button size="sm" color="success" onPress={() => handlePublishPost(post.id)}>
                        Publish
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-default-500">No posts found in this category.</p>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={onLoginModalOpenChange}
        onLoginSuccess={login}
      />

      {/* Post View/Edit Modal */}
      <Modal 
        isOpen={isPostModalOpen} 
        onOpenChange={onPostModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditing ? 'Edit Post' : selectedPost?.title}
              </ModalHeader>
              <ModalBody>
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <Input
                      label="Slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Category"
                        selectedKeys={[formData.category]}
                        onSelectionChange={(keys) => {
                          const category = Array.from(keys)[0] as 'CTF' | 'Flipper Zero';
                          setFormData({...formData, category, subcategory: ''});
                        }}
                      >
                        <SelectItem key="CTF" value="CTF">CTF</SelectItem>
                        <SelectItem key="Flipper Zero" value="Flipper Zero">Flipper Zero</SelectItem>
                      </Select>
                      <Select
                        label="Subcategory"
                        selectedKeys={formData.subcategory ? [formData.subcategory] : []}
                        onSelectionChange={(keys) => {
                          const subcategory = Array.from(keys)[0] as string;
                          setFormData({...formData, subcategory});
                        }}
                      >
                        {SUBCATEGORIES[formData.category].map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </Select>
                    </div>
                    <Input
                      label="Tags (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      description="Click suggested tags below to add them"
                    />
                    <div className="flex flex-wrap gap-2">
                      {getCurrentTags().map((tag) => (
                        <Chip
                          key={tag}
                          size="sm"
                          variant="flat"
                          className="cursor-pointer hover:bg-primary hover:text-white"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                    <Input
                      label="Excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({...formData, content})}
                        postId={selectedPost?.id || `new-post-${Date.now()}`}
                      />
                    </div>
                    <Switch
                      isSelected={formData.published}
                      onValueChange={(checked) => setFormData({...formData, published: checked})}
                    >
                      Published
                    </Switch>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedPost?.tags.map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedPost?.content || '' }} />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {isEditing ? (
                  <>
                    <Button variant="light" onPress={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    {isAuthenticated && (
                      <Button color="danger" variant="light" onPress={() => selectedPost && handleDeletePost(selectedPost.id)}>
                        Delete
                      </Button>
                    )}
                    <Button color="primary" onPress={handleUpdatePost}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="light" onPress={onClose}>
                      Close
                    </Button>
                    {isAuthenticated && (
                      <Button color="warning" onPress={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Create Post Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onOpenChange={onCreateModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Post</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                  <Input
                    label="Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    description="URL-friendly version of the title"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      selectedKeys={[formData.category]}
                      onSelectionChange={(keys) => {
                        const category = Array.from(keys)[0] as 'CTF' | 'Flipper Zero';
                        setFormData({...formData, category, subcategory: ''});
                      }}
                    >
                      <SelectItem key="CTF" value="CTF">CTF</SelectItem>
                      <SelectItem key="Flipper Zero" value="Flipper Zero">Flipper Zero</SelectItem>
                    </Select>
                    <Select
                      label="Subcategory"
                      selectedKeys={formData.subcategory ? [formData.subcategory] : []}
                      onSelectionChange={(keys) => {
                        const subcategory = Array.from(keys)[0] as string;
                        setFormData({...formData, subcategory});
                      }}
                    >
                      {SUBCATEGORIES[formData.category].map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Input
                    label="Tags (comma separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                  <div className="flex flex-wrap gap-2">
                    {getCurrentTags().map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="flat"
                        className="cursor-pointer hover:bg-primary hover:text-white"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  <Input
                    label="Excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                      postId={`new-post-${Date.now()}`}
                    />
                  </div>
                  <Switch
                    isSelected={formData.published}
                    onValueChange={(checked) => setFormData({...formData, published: checked})}
                  >
                    Published
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCreatePost}>
                  Create Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const PostsManager = () => {
  return (
    <AuthProvider>
      <PostsManagerContent />
    </AuthProvider>
  );
};

export default PostsManager;
