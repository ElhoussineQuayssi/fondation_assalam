// Import database connection
import { supabaseAdmin } from "./db";

export async function getBlogs() {
  try {
    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.warn("Supabase admin client not available, returning mock data - check SUPABASE_SERVICE_ROLE_KEY environment variable");
      // Return mock blog data for development
      const mockBlogs = [
        {
          id: "1",
          title: "Premier article de blog",
          slug: "premier-article",
          excerpt: "Ceci est un exemple d'article de blog pour la démonstration.",
          content: ["Contenu de l'article de blog exemple."],
          category: "actualites",
          tags: ["exemple", "blog"],
          image: "/uploads/image-1760666702704-b102b73136efb554f15ded5bd5bac4d6.png",
          date: "2024-01-15",
          created_at: "2024-01-15T10:00:00.000Z",
          updated_at: "2024-01-15T10:00:00.000Z"
        },
        {
          id: "2",
          title: "Deuxième article de blog",
          slug: "deuxieme-article",
          excerpt: "Un autre exemple d'article pour illustrer le contenu.",
          content: ["Plus de contenu d'exemple pour le blog."],
          category: "projets",
          tags: ["projet", "exemple"],
          image: "/uploads/image-1760666702704-b102b73136efb554f15ded5bd5bac4d6.png",
          date: "2024-01-20",
          created_at: "2024-01-20T10:00:00.000Z",
          updated_at: "2024-01-20T10:00:00.000Z"
        }
      ];
      return { success: true, data: mockBlogs };
    }

    const { data: blogs, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des articles",
      };
    }

    return { success: true, data: blogs };
  } catch (error) {
    console.error("Unexpected error fetching blogs:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des articles",
    };
  }
}

export function getBlog(slug) {
  const blogs = getBlogs();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return null;

  // Si les contenus sont vides, on ajoute des données de remplissage pour la démo
  if (!blog.content || blog.content.length === 0) {
    blog.content = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus justo, ut mattis felis aliquet non. Morbi mattis lorem id augue semper, non aliquam dolor aliquet. Nulla facilisi.",
      "Praesent quis risus ac nisi consectetur interdum. Nulla facilisi. Cras non lobortis nulla. Sed scelerisque metus sit amet tempor euismod. Nullam tincidunt, est vel sagittis volutpat, purus est sagittis magna, nec ultrices purus risus vel nisi.",
      "Donec euismod, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Donec euismod, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
      "Integer ultricies rhoncus libero, nec eleifend purus interdum at. Fusce eu quam a augue lobortis dapibus eu in sapien. Aliquam id nisi malesuada, convallis sapien eget, mattis dui. Nullam vitae nisl ac nisi bibendum commodo.",
      "Sed auctor, magna in pulvinar lacinia, lacus nisi aliquam velit, at dignissim ante metus a elit. Sed auctor, magna in pulvinar lacinia, lacus nisi aliquam velit, at dignissim ante metus a elit.",
    ];
  }

  // Si pas de tags, on en ajoute
  if (!blog.tags) {
    const categories = ["maroc", "développement", "solidarité"];
    blog.tags = [blog.category.toLowerCase(), ...categories];
  }

  // Si pas de posts liés, on en ajoute
  if (!blog.relatedPosts) {
    blog.relatedPosts = blogs
      .filter((b) => b.id !== blog.id)
      .slice(0, 2)
      .map((b) => ({
        slug: b.slug,
        title: b.title,
        date: b.date,
        image: b.image,
      }));
  }

  return blog;
}
