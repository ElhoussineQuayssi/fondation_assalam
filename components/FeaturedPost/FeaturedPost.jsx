import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Featured Post (Large horizontal card using Accent border).
 */
const FeaturedPost = ({ post }) => {
  if (!post) return null;
  return (
    <div
      className="card-lift mb-16 rounded-xl overflow-hidden shadow-2xl transition duration-500 hover:scale-[1.005] scroll-reveal"
      style={{ borderLeft: `8px solid #6495ED`, backgroundColor: "white" }}
    >
      <Link href={`/blogs/${post.slug}`} className="grid md:grid-cols-3 gap-8">
        <div className="relative h-64 md:h-full md:col-span-1">
          <Image
            src={post.image || "/placeholder.svg?height=800&width=1200"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="md:col-span-2 p-8 flex flex-col justify-center">
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full mb-3 inline-block self-start"
            style={{ backgroundColor: "#6495ED1A", color: "#6495ED" }}
          >
            {post.category}
          </span>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#333333" }}>
            {post.title}
          </h2>
          <p className="text-lg text-gray-700 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <span className="font-semibold" style={{ color: "#6495ED" }}>
            Découvrir le récit &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedPost;
