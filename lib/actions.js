"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./db";
import { hashPassword, comparePasswords, createSession } from "./auth";
import { cookies } from "next/headers";
import { cache, CACHE_KEYS } from "./cache";

// Message functions
export async function saveMessage(formData) {
  try {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message");
    const type = formData.get("type") || "contact";

    if (!firstName || !lastName || !email || !message) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    const { error } = await supabaseAdmin.from("messages").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      message,
      type,
    });

    if (error) {
      console.error("Error saving message:", error);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
      };
    }

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Message envoyé avec succès.",
    };
  } catch (error) {
    console.error("Unexpected error saving message:", error);
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
    };
  }
}

export async function getMessages() {
  try {
    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des messages",
      };
    }

    return { success: true, data: messages };
  } catch (error) {
    console.error("Unexpected error fetching messages:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des messages",
    };
  }
}

// Blog functions
export async function saveNewBlog(formData) {
  try {
    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    const category = formData.get("category");
    const status = formData.get("status");
    const shareOnSocial = formData.get("shareOnSocial") === "true";
    const image = formData.get("imagePath"); // Get the image path from the form data

    if (!title || !excerpt || !content || !category || !status) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .trim();

    const { error } = await supabaseAdmin.from("blog_posts").insert({
      title,
      slug,
      excerpt,
      content,
      category,
      status,
      share_on_social: shareOnSocial,
      image,
      published_at: status === 'published' ? new Date().toISOString() : null,
    });

    if (error) {
      console.error("Error creating blog post:", error);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la création de l'article. Veuillez réessayer.",
      };
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return {
      success: true,
      message: "Article créé avec succès.",
      slug,
    };
  } catch (error) {
    console.error("Unexpected error creating blog post:", error);
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de la création de l'article. Veuillez réessayer.",
    };
  }
}

export async function getBlogs() {
  try {
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

export async function getBlogById(id) {
  try {
    const { data: blog, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !blog) {
      console.error("Error fetching blog by ID:", error);
      return { success: false, message: "Article introuvable." };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error("Unexpected error fetching blog by ID:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération de l'article.",
    };
  }
}

export async function getBlogBySlug(slug) {
  try {
    const { data: blog, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !blog) {
      console.error("Error fetching blog by slug:", error);
      return { success: false, message: "Article introuvable." };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error("Unexpected error fetching blog by slug:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération de l'article.",
    };
  }
}

export async function incrementBlogViews(slug) {
  try {
    if (!slug) {
      return { success: false, message: "Slug du blog requis." };
    }

    // Check if blog exists and get current views
    const { data: blog, error: fetchError } = await supabaseAdmin
      .from("blog_posts")
      .select("id, views")
      .eq("slug", slug)
      .single();

    if (fetchError || !blog) {
      console.error("Error fetching blog for views increment:", fetchError);
      return { success: false, message: "Article non trouvé." };
    }

    // Increment views count
    const newViews = (blog.views || 0) + 1;
    const { error: updateError } = await supabaseAdmin
      .from("blog_posts")
      .update({ views: newViews })
      .eq("slug", slug);

    if (updateError) {
      console.error("Error updating blog views:", updateError);
      return {
        success: false,
        message: "Erreur lors de l'incrémentation des vues.",
      };
    }

    return { success: true, views: newViews };
  } catch (error) {
    console.error("Unexpected error incrementing blog views:", error);
    return {
      success: false,
      message: "Erreur lors de l'incrémentation des vues.",
    };
  }
}

export async function deleteBlog(id) {
  try {
    // Check if blog exists
    const { data: blog, error: fetchError } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !blog) {
      console.error("Blog not found for deletion:", fetchError);
      return { success: false, message: "Article non trouvé." };
    }

    // Delete the blog
    const { error: deleteError } = await supabaseAdmin
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting blog:", deleteError);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la suppression de l'article.",
      };
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");

    return { success: true, message: "Article supprimé avec succès." };
  } catch (error) {
    console.error("Unexpected error deleting blog:", error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la suppression de l'article.",
    };
  }
}

export async function updateBlog(id, formData) {
  try {
    const title = formData.get("title");
    const excerpt = formData.get("excerpt");
    const content = formData.get("content");
    const category = formData.get("category");
    const status = formData.get("status");
    const shareOnSocial = formData.get("shareOnSocial") === "true";

    if (!title || !excerpt || !content || !category || !status) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if new slug conflicts with existing ones (except current blog)
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error checking slug conflict:", checkError);
      return {
        success: false,
        message: "Erreur lors de la vérification du slug.",
      };
    }

    if (existing) {
      return {
        success: false,
        message: "Un article avec ce titre existe déjà.",
      };
    }

    // Get current blog to check status change
    const { data: currentBlog, error: fetchError } = await supabaseAdmin
      .from("blog_posts")
      .select("status, published_at")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching current blog:", fetchError);
      return {
        success: false,
        message: "Erreur lors de la récupération de l'article actuel.",
      };
    }

    // Determine published_at value
    let publishedAt = currentBlog.published_at;
    if (currentBlog.status === 'draft' && status === 'published') {
      publishedAt = new Date().toISOString();
    } else if (status === 'draft') {
      publishedAt = null;
    }

    const { error: updateError } = await supabaseAdmin
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        category,
        status,
        share_on_social: shareOnSocial,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating blog:", updateError);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la mise à jour de l'article.",
      };
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return {
      success: true,
      message: "Article mis à jour avec succès.",
      slug,
    };
  } catch (error) {
    console.error("Unexpected error updating blog:", error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la mise à jour de l'article.",
    };
  }
}

// Admin functions
export async function login(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        success: false,
        message: "Veuillez fournir un email et un mot de passe.",
      };
    }

    const { data: admin, error: fetchError } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !admin) {
      console.error("Admin not found:", fetchError);
      return { success: false, message: "Identifiants incorrects." };
    }

    // Check if account is locked
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      return {
        success: false,
        message:
          "Compte temporairement verrouillé. Veuillez réessayer plus tard.",
      };
    }

    // Verify password
    const isValidPassword = await comparePasswords(password, admin.password);

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = (admin.failed_attempts || 0) + 1;
      let lockedUntil = null;

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      const { error: updateError } = await supabaseAdmin
        .from("admins")
        .update({
          failed_attempts: failedAttempts,
          locked_until: lockedUntil,
        })
        .eq("id", admin.id);

      if (updateError) {
        console.error("Error updating failed attempts:", updateError);
      }

      return { success: false, message: "Identifiants incorrects." };
    }

    // Reset failed attempts and update last login
    const { error: resetError } = await supabaseAdmin
      .from("admins")
      .update({
        failed_attempts: 0,
        locked_until: null,
        last_login: new Date().toISOString(),
      })
      .eq("id", admin.id);

    if (resetError) {
      console.error("Error resetting admin login state:", resetError);
    }

    // Create session after successful login
    const sessionResult = await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    if (!sessionResult.success) {
      return { success: false, message: "Erreur de session" };
    }

    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return {
      success: false,
      message: "Une erreur s'est produite. Veuillez réessayer.",
    };
  }
}

export async function createAdmin(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const role = formData.get("role");

    if (!email || !password || !name || !role) {
      return { success: false, message: "Tous les champs sont obligatoires" };
    }

    // Password strength validation
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return {
        success: false,
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      };
    }

    const hashedPassword = await hashPassword(password);

    const { error } = await supabaseAdmin.from("admins").insert({
      email,
      password: hashedPassword,
      name,
      role,
      last_password_change: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating admin:", error);
      if (error.code === "23505") {
        // Unique constraint violation
        return { success: false, message: "Cet email est déjà utilisé." };
      }
      return {
        success: false,
        message: "Erreur lors de la création de l'administrateur",
      };
    }

    return { success: true, message: "Administrateur créé avec succès" };
  } catch (error) {
    console.error("Unexpected error creating admin:", error);
    return {
      success: false,
      message: "Erreur lors de la création de l'administrateur",
    };
  }
}

export async function updateAdmin(id, formData) {
  try {
    const email = formData.get("email");
    const name = formData.get("name");
    const role = formData.get("role");
    const password = formData.get("password"); // Optional - only if changing password

    if (!email || !name || !role) {
      return {
        success: false,
        message: "Email, nom et rôle sont obligatoires",
      };
    }

    // Check if email exists for other admins
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("email", email)
      .neq("id", id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error checking email conflict:", checkError);
      return {
        success: false,
        message: "Erreur lors de la vérification de l'email.",
      };
    }

    if (existing) {
      return {
        success: false,
        message: "Cet email est déjà utilisé par un autre administrateur.",
      };
    }

    let updateData = { email, name, role };

    if (password) {
      // Validate password if provided
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
      ) {
        return {
          success: false,
          message:
            "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        };
      }

      const hashedPassword = await hashPassword(password);
      updateData.password = hashedPassword;
      updateData.last_password_change = new Date().toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from("admins")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Error updating admin:", updateError);
      return {
        success: false,
        message: "Erreur lors de la mise à jour de l'administrateur",
      };
    }

    revalidatePath("/admin/admins");

    return {
      success: true,
      message: "Administrateur mis à jour avec succès",
    };
  } catch (error) {
    console.error("Unexpected error updating admin:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour de l'administrateur",
    };
  }
}

export async function deleteAdmin(id) {
  try {
    const { error } = await supabaseAdmin.from("admins").delete().eq("id", id);

    if (error) {
      console.error("Error deleting admin:", error);
      return {
        success: false,
        message: "Erreur lors de la suppression de l'administrateur",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting admin:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression de l'administrateur",
    };
  }
}

export async function getAdmins() {
  try {
    const { data: admins, error } = await supabaseAdmin
      .from("admins")
      .select("id, email, name, role, created_at, last_login")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admins:", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des administrateurs",
      };
    }

    return { success: true, data: admins };
  } catch (error) {
    console.error("Unexpected error fetching admins:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des administrateurs",
    };
  }
}

export async function getStats() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Initialize default values
    let totalBlogs = 0;
    let newBlogs = 0;
    let totalMessages = 0;
    let newMessages = 0;
    let totalViews = 0;
    let currentViews = 0;
    let previousViews = 0;
    let totalProjects = 0;
    let newProjects = 0;
    let totalBeneficiaries = 0;
    let totalAdmins = 0;
    let recentBlogs = [];
    let recentMessages = [];
    let recentProjects = [];

    // Get total blogs and new blogs (last 30 days) - handle errors gracefully
    try {
      const { data: totalBlogsData, error: blogsError } = await supabaseAdmin
        .from("blog_posts")
        .select("id, created_at", { count: "exact" });

      if (!blogsError && totalBlogsData) {
        totalBlogs = totalBlogsData.length || 0;
        newBlogs =
          totalBlogsData.filter(
            (blog) => new Date(blog.created_at) >= thirtyDaysAgo,
          ).length || 0;
      } else {
        console.warn("Failed to fetch blogs data:", blogsError);
      }
    } catch (error) {
      console.warn("Error fetching blogs data:", error);
    }

    // Get total messages and new messages - handle errors gracefully
    try {
      const { data: totalMessagesData, error: messagesError } =
        await supabaseAdmin
          .from("messages")
          .select("id, created_at", { count: "exact" });

      if (!messagesError && totalMessagesData) {
        totalMessages = totalMessagesData.length || 0;
        newMessages =
          totalMessagesData.filter(
            (message) => new Date(message.created_at) >= thirtyDaysAgo,
          ).length || 0;
      } else {
        console.warn("Failed to fetch messages data:", messagesError);
      }
    } catch (error) {
      console.warn("Error fetching messages data:", error);
    }

    // Get total views and views change - handle errors gracefully
    try {
      const { data: viewsData, error: viewsError } = await supabaseAdmin
        .from("blog_posts")
        .select("views, created_at");

      if (!viewsError && viewsData) {
        totalViews =
          viewsData.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0;
        previousViews =
          viewsData
            .filter((blog) => new Date(blog.created_at) < thirtyDaysAgo)
            .reduce((sum, blog) => sum + (blog.views || 0), 0) || 0;

        currentViews =
          viewsData
            .filter((blog) => new Date(blog.created_at) >= thirtyDaysAgo)
            .reduce((sum, blog) => sum + (blog.views || 0), 0) || 0;
      } else {
        console.warn("Failed to fetch views data:", viewsError);
      }
    } catch (error) {
      console.warn("Error fetching views data:", error);
    }

    // Get total projects and new projects (last 30 days) - handle errors gracefully
    try {
      const { data: totalProjectsData, error: projectsError } =
        await supabaseAdmin
          .from("projects")
          .select("id, created_at", { count: "exact" });

      if (!projectsError && totalProjectsData) {
        totalProjects = totalProjectsData.length || 0;
        newProjects =
          totalProjectsData.filter(
            (project) => new Date(project.created_at) >= thirtyDaysAgo,
          ).length || 0;
      } else {
        console.warn("Failed to fetch projects data:", projectsError);
      }
    } catch (error) {
      console.warn("Error fetching projects data:", error);
    }

    // Get total beneficiaries from projects - handle errors gracefully
    try {
      const { data: beneficiariesData, error: beneficiariesError } =
        await supabaseAdmin
          .from("projects")
          .select("people_helped")
          .not("people_helped", "is", null)
          .neq("people_helped", "");

      if (!beneficiariesError && beneficiariesData) {
        totalBeneficiaries =
          beneficiariesData.reduce((sum, project) => {
            const num = parseInt(project.people_helped);
            return sum + (isNaN(num) ? 0 : num);
          }, 0) || 0;
      } else {
        console.warn("Failed to fetch beneficiaries data:", beneficiariesError);
      }
    } catch (error) {
      console.warn("Error fetching beneficiaries data:", error);
    }

    // Get recent blogs - handle errors gracefully
    try {
      const { data: recentBlogsData, error: recentBlogsError } = await supabaseAdmin
        .from("blog_posts")
        .select("id, title, views, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!recentBlogsError && recentBlogsData) {
        recentBlogs = recentBlogsData.map((blog) => ({
          id: blog.id,
          title: blog.title,
          views: blog.views,
          date: blog.created_at,
        })) || [];
      } else {
        console.warn("Failed to fetch recent blogs:", recentBlogsError);
      }
    } catch (error) {
      console.warn("Error fetching recent blogs:", error);
    }

    // Get recent messages - handle errors gracefully
    try {
      const { data: recentMessagesRaw, error: recentMessagesError } =
        await supabaseAdmin
          .from("messages")
          .select("id, first_name, last_name, message, type, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

      if (!recentMessagesError && recentMessagesRaw) {
        recentMessages =
          recentMessagesRaw.map((msg) => ({
            id: msg.id,
            name: `${msg.first_name} ${msg.last_name}`,
            excerpt:
              msg.message.length > 50
                ? msg.message.substring(0, 50) + "..."
                : msg.message,
            type: msg.type,
            date: msg.created_at,
          })) || [];
      } else {
        console.warn("Failed to fetch recent messages:", recentMessagesError);
      }
    } catch (error) {
      console.warn("Error fetching recent messages:", error);
    }

    // Get recent projects - handle errors gracefully
    try {
      const { data: recentProjectsData, error: recentProjectsError } =
        await supabaseAdmin
          .from("projects")
          .select("id, title, people_helped, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

      if (!recentProjectsError && recentProjectsData) {
        recentProjects = recentProjectsData.map((project) => ({
          id: project.id,
          title: project.title,
          peopleHelped: project.people_helped,
          date: project.created_at,
        })) || [];
      } else {
        console.warn("Failed to fetch recent projects:", recentProjectsError);
      }
    } catch (error) {
      console.warn("Error fetching recent projects:", error);
    }

    // Get total administrators - handle errors gracefully
    try {
      const { count: totalAdminsCount, error: adminsError } = await supabaseAdmin
        .from("admins")
        .select("*", { count: "exact", head: true });

      if (!adminsError) {
        totalAdmins = totalAdminsCount || 0;
      } else {
        console.warn("Failed to fetch admins count:", adminsError);
      }
    } catch (error) {
      console.warn("Error fetching admins count:", error);
    }

    // Calculate percentages
    const newBlogsPercent = Math.round((newBlogs / totalBlogs) * 100) || 0;
    const newMessagesPercent =
      Math.round((newMessages / totalMessages) * 100) || 0;
    const newProjectsPercent =
      Math.round((newProjects / totalProjects) * 100) || 0;
    const viewsChangePercent = previousViews
      ? Math.round(((currentViews - previousViews) / previousViews) * 100)
      : 0;

    return {
      success: true,
      totalBlogs,
      newBlogsPercent,
      totalMessages,
      newMessagesPercent,
      totalProjects,
      newProjectsPercent,
      totalViews,
      totalBeneficiaries,
      totalAdmins,
      projectsCount: totalProjects, // For backward compatibility
      adminsCount: totalAdmins, // For backward compatibility
      viewsChangePercent,
      recentBlogs,
      recentMessages,
      recentProjects,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    };
  }
}

// Message management functions
export async function markMessageAsRead(id) {
  try {
    const { error } = await supabaseAdmin
      .from("messages")
      .update({ status: "read" })
      .eq("id", id);

    if (error) {
      console.error("Error marking message as read:", error);
      return { success: false };
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error marking message as read:", error);
    return { success: false };
  }
}

export async function deleteMessage(id) {
  try {
    // Extract ID if an object is passed
    const messageId = typeof id === "object" && id.id ? id.id : id;

    if (!messageId) {
      return { success: false, message: "ID du message manquant" };
    }

    const { error } = await supabaseAdmin
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      console.error("Error deleting message:", error);
      return {
        success: false,
        message: "Erreur lors de la suppression du message",
      };
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting message:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du message",
    };
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies(); // No need to await, cookies() is synchronous
    cookieStore.delete("admin-session"); // Use the correct cookie name
    return { success: true };
  } catch {
    return { success: false, message: "Erreur lors de la déconnexion." };
  }
}

// Project functions
export async function saveNewProject(projectData) {
  try {
    const {
      title,
      excerpt,
      image,
      categories,
      startDate,
      location,
      peopleHelped,
      status,
      content,
      goals,
      gallery,
    } = projectData;

    if (!title || !excerpt || !categories || categories.length === 0) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if slug already exists
    const { data: existingProject, error: checkError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error checking project slug:", checkError);
      return {
        success: false,
        message: "Erreur lors de la vérification du slug.",
      };
    }

    if (existingProject) {
      return {
        success: false,
        message: "Un projet avec ce titre existe déjà.",
      };
    }

    // Generate project ID
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const { error: insertError } = await supabaseAdmin.from("projects").insert({
      id,
      slug,
      title,
      excerpt,
      image,
      categories,
      start_date: startDate,
      location,
      people_helped: peopleHelped,
      status,
      content,
      goals,
      gallery,
    });

    if (insertError) {
      console.error("Error creating project:", insertError);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la création du projet. Veuillez réessayer.",
      };
    }

    // Clear projects cache on creation
    cache.clear();

    // Project created successfully - no need to generate static page
    return {
      success: true,
      message: "Projet créé avec succès.",
      slug,
    };
  } catch (error) {
    console.error("Unexpected error creating project:", error);
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de la création du projet. Veuillez réessayer.",
    };
  }
}

export async function getProjects() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select(
        "id, slug, title, excerpt, image, categories, start_date, location, people_helped, status, content, goals, gallery, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des projets",
      };
    }

    // Projects already have JSON fields parsed by Supabase
    return { success: true, data: projects };
  } catch (error) {
    console.error("Unexpected error loading projects:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des projets",
    };
  }
}

export async function updateProject(id, projectData) {
  try {
    const {
      title,
      excerpt,
      image,
      categories,
      startDate,
      location,
      peopleHelped,
      status,
      content,
      goals,
      gallery,
    } = projectData;

    if (!title || !excerpt || !categories || categories.length === 0) {
      return {
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      };
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if another project with same slug exists (excluding current project)
    const { data: existingProject, error: checkError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error checking project slug conflict:", checkError);
      return {
        success: false,
        message: "Erreur lors de la vérification du slug.",
      };
    }

    if (existingProject) {
      return {
        success: false,
        message: "Un projet avec ce titre existe déjà.",
      };
    }

    // Check if project exists
    const { data: projectExists, error: existsError } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("id", id)
      .single();

    if (existsError || !projectExists) {
      console.error("Project not found:", existsError);
      return {
        success: false,
        message: "Projet non trouvé.",
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from("projects")
      .update({
        slug,
        title,
        excerpt,
        image,
        categories,
        start_date: startDate,
        location,
        people_helped: peopleHelped,
        status,
        content,
        goals,
        gallery,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating project:", updateError);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la mise à jour du projet. Veuillez réessayer.",
      };
    }

    // Clear projects cache on update
    cache.clear();

    // Project updated successfully - no need to regenerate static page
    return {
      success: true,
      message: "Projet mis à jour avec succès.",
      slug,
    };
  } catch (error) {
    console.error("Unexpected error updating project:", error);
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de la mise à jour du projet. Veuillez réessayer.",
    };
  }
}

export async function deleteProject(id) {
  try {
    // Check if project exists
    const { data: project, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !project) {
      console.error("Project not found for deletion:", fetchError);
      return { success: false, message: "Projet non trouvé." };
    }

    // Delete the project
    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting project:", deleteError);
      return {
        success: false,
        message: "Une erreur s'est produite lors de la suppression du projet.",
      };
    }

    // Clear projects cache on deletion
    cache.clear();

    return { success: true, message: "Projet supprimé avec succès." };
  } catch (error) {
    console.error("Unexpected error deleting project:", error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la suppression du projet.",
    };
  }
}
