'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Chip, Button, Divider} from "@nextui-org/react";
import Navbar from "../../components/Navbar";
import { BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import Link from 'next/link';
import '../../prose.css';

export default function PostDetails({params}:{params:{postId:string}}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <h1 className="text-3xl font-bold">{post.title}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <Chip size="sm" color={
                      post.category === 'CTF' ? 'success' : 
                      post.category === 'Flipper Zero' ? 'warning' : 
                      'secondary'
                    }>
                      {post.category}
                    </Chip>
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
      </div>
    </main>
  );
}