import { notFound } from "next/navigation";
import { getBlogPost, getRelatedPosts } from "@/lib/wordpress";
import BlogContent from "./BlogContent";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug);

  return <BlogContent post={post} relatedPosts={relatedPosts} />;
}
