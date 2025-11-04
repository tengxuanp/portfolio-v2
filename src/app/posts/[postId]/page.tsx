'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Chip, Button, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Switch, useDisclosure } from "@nextui-org/react";
import Navbar from "../../components/Navbar";
import { BlogPost, SUBCATEGORIES } from '@/types/blog';
import { useAuth } from '../../components/AuthContext';
import LoginModal from '../../components/LoginModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import '../../prose.css';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), {
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

export default function PostDetails({params}:{params:{postId:string}}) {
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onOpenChange: onEditModalOpenChange } = useDisclosure();
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onOpenChange: onLoginModalOpenChange } = useDisclosure();

  useEffect(() => {
    fetchPost();
  }, [params.postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (!isAuthenticated) {
      onLoginModalOpen();
      return;
    }
    if (!post) return;
    
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
    onEditModalOpen();
  };

  const handleUpdatePost = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          subcategory: formData.subcategory,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          published: formData.published,
          excerpt: formData.excerpt,
          slug: formData.slug,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        onEditModalOpenChange();
        // Show success message or notification
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    }
  };

  const togglePublished = async () => {
    if (!post || !isAuthenticated) return;
    
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...post,
          published: !post.published,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  if (loading) {
    return (
      <main className="text-foreground bg-background min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            Loading post...
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="text-foreground bg-background min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <Link href="/posts">
              <Button color="primary">Back to Posts</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="text-foreground bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/posts">
              <Button variant="light" className="mb-6">
                ← Back to Posts
              </Button>
            </Link>
            
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col w-full gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h1 className="text-3xl font-bold flex-1">{post.title}</h1>
                    {isAuthenticated && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={openEditModal}
                        >
                          ✏️ Edit Post
                        </Button>
                        <Button
                          size="sm"
                          color={post.published ? "warning" : "success"}
                          variant="flat"
                          onPress={togglePublished}
                        >
                          {post.published ? "📝 Unpublish" : "📢 Publish"}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
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
                    {isAuthenticated && !post.published && (
                      <Chip size="sm" color="warning" variant="flat">
                        DRAFT
                      </Chip>
                    )}
                    <span className="text-sm text-default-500">
                      Published on {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                    </span>
                    {post.updatedAt !== post.createdAt && (
                      <span className="text-sm text-default-500">
                        Updated on {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </CardBody>
            </Card>

      {/* Edit Post Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onOpenChange={onEditModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Post</ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                    {(SUBCATEGORIES[formData.category] || []).map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </Select>
                </div>
                <Input
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
                <Input
                  label="Excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                />
                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={formData.published}
                    onValueChange={(published) => setFormData({...formData, published})}
                  >
                    Published
                  </Switch>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    postId={post?.id}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdatePost}>
                  Update Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={onLoginModalOpenChange}
        onLoginSuccess={() => {
          onLoginModalOpenChange();
          // Optionally refresh the page to update auth state
          window.location.reload();
        }}
      />
      </div>
    </main>
  );
}