'use client';
import PostsManager from "../components/PostsManagerNew"
import Navbar from "../components/Navbar"

export default function Posts() {
  return (
    <main className="text-foreground bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PostsManager />
      </div>
    </main>
  );
}
