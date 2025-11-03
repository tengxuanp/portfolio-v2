import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/utils/blogService';
import { requireAuth } from '@/utils/auth';

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, subcategory, tags, published = false, excerpt, slug, images } = body;

    if (!title || !content || !category || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = createPost({
      title,
      content,
      category,
      subcategory,
      tags: tags || [],
      published,
      excerpt,
      slug,
      images: images || [],
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
