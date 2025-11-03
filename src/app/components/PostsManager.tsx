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
  Textarea,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { BlogPost, SUBCATEGORIES } from '@/types/blog';
import { AuthProvider, useAuth } from './AuthContext';
import LoginModal from './LoginModal';
import RichTextEditor from './RichTextEditor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import '../prose.css';

const PostsManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'CTF' | 'Reviews' | 'Flipper Zero'>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'CTF' as 'CTF' | 'Reviews' | 'Flipper Zero',
    tags: '',
    published: false,
    excerpt: '',
    slug: '',
  });

  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onOpenChange: onPostModalOpenChange } = useDisclosure();
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onOpenChange: onCreateModalOpenChange } = useDisclosure();

  // Predefined tags for different categories
  const ctfTags = ['Active Directory', 'Windows', 'Linux', 'HTB Season 9', 'OSCP', 'Web Exploitation', 'Binary Exploitation', 'Reverse Engineering', 'Forensics', 'Cryptography'];
  const reviewTags = ['Certification', 'Course Review', 'Tool Review', 'Book Review', 'Conference'];
  const flipperTags = ['Sub-GHz', 'NFC', 'RFID', 'Infrared', 'GPIO', 'Hardware Hacking', 'RF Analysis', 'ISM Band', '433MHz', '315MHz'];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts.filter(post => post.published));
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory && post.published));
    }
  }, [posts, selectedCategory]);

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
      }
    } catch (error) {
      console.error('Failed to create post:', error);
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
      }
    } catch (error) {
      console.error('Failed to update post:', error);
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
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'CTF',
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
    resetForm();
    onCreateModalOpen();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading posts...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cybersecurity Blog</h1>
        <Button color="primary" onPress={openCreateModal}>
          Create New Post
        </Button>
      </div>

      <Tabs 
        selectedKey={selectedCategory} 
        onSelectionChange={(key) => setSelectedCategory(key as 'all' | 'CTF' | 'Reviews' | 'Flipper Zero')}
        className="mb-6"
      >
        <Tab key="all" title="All Posts" />
        <Tab key="CTF" title="CTF Writeups" />
        <Tab key="Flipper Zero" title="Flipper Zero" />
        <Tab key="Reviews" title="Reviews" />
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex flex-col w-full">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <Chip size="sm" color={
                    post.category === 'CTF' ? 'success' : 
                    post.category === 'Flipper Zero' ? 'warning' : 
                    'secondary'
                  }>
                    {post.category}
                  </Chip>
                  <span className="text-xs text-default-500">
                    {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <p className="text-sm text-default-600 mb-3 line-clamp-3">
                {post.excerpt || post.content.substring(0, 150) + '...'}
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
                <Button size="sm" variant="light" onPress={() => openViewModal(post)}>
                  Read
                </Button>
                <Button size="sm" variant="light" color="warning" onPress={() => openEditModal(post)}>
                  Edit
                </Button>
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
                    <Select
                      label="Category"
                      selectedKeys={[formData.category]}
                      onChange={(e) => setFormData({...formData, category: e.target.value as 'CTF' | 'Reviews' | 'Flipper Zero'})}
                    >
                      <SelectItem key="CTF" value="CTF">CTF</SelectItem>
                      <SelectItem key="Flipper Zero" value="Flipper Zero">Flipper Zero</SelectItem>
                      <SelectItem key="Reviews" value="Reviews">Reviews</SelectItem>
                    </Select>
                    <Input
                      label="Tags (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      description="Suggested tags will appear below"
                    />
                    <div className="flex flex-wrap gap-2">
                      {(formData.category === 'CTF' ? ctfTags : 
                        formData.category === 'Flipper Zero' ? flipperTags : 
                        reviewTags).map((tag) => (
                        <Chip
                          key={tag}
                          size="sm"
                          variant="flat"
                          className="cursor-pointer"
                          onClick={() => {
                            const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                            if (!currentTags.includes(tag)) {
                              setFormData({...formData, tags: [...currentTags, tag].join(', ')});
                            }
                          }}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                    <Textarea
                      label="Excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      rows={2}
                    />
                    <Textarea
                      label="Content (Markdown)"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={15}
                    />
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedPost?.content || ''}
                      </ReactMarkdown>
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
                    <Button color="danger" variant="light" onPress={() => selectedPost && handleDeletePost(selectedPost.id)}>
                      Delete
                    </Button>
                    <Button color="primary" onPress={handleUpdatePost}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="warning" onPress={() => setIsEditing(true)}>
                      Edit
                    </Button>
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
        size="4xl"
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
                  <Select
                    label="Category"
                    selectedKeys={[formData.category]}
                    onChange={(e) => setFormData({...formData, category: e.target.value as 'CTF' | 'Reviews' | 'Flipper Zero'})}
                  >
                    <SelectItem key="CTF" value="CTF">CTF</SelectItem>
                    <SelectItem key="Flipper Zero" value="Flipper Zero">Flipper Zero</SelectItem>
                    <SelectItem key="Reviews" value="Reviews">Reviews</SelectItem>
                  </Select>
                  <Input
                    label="Tags (comma separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                  <div className="flex flex-wrap gap-2">
                    {(formData.category === 'CTF' ? ctfTags : reviewTags).map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="flat"
                        className="cursor-pointer"
                        onClick={() => {
                          const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                          if (!currentTags.includes(tag)) {
                            setFormData({...formData, tags: [...currentTags, tag].join(', ')});
                          }
                        }}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  <Textarea
                    label="Excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={2}
                  />
                  <Textarea
                    label="Content (Markdown)"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={12}
                  />
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

export default PostsManager;
