import { supabaseAdmin } from "./db.js";

/**
 * Read projects from database with pagination support
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of projects to return (default: 50)
 * @param {number} options.offset - Number of projects to skip (default: 0)
 * @param {boolean} options.summary - If true, excludes large JSONB fields (default: false)
 * @returns {Project[]} Array of projects
 */
export async function getProjects(options = {}) {
  const { limit = 50, offset = 0, summary = false } = options;

  // Fallback if Supabase admin client is not available
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not available, returning empty projects array - check SUPABASE_SERVICE_ROLE_KEY environment variable");
    return [];
  }

  try {
    console.log('[DEBUG] getProjects: Starting database query with options:', { limit, offset, summary });

    let query = supabaseAdmin
      .from("projects")
      .select(
        summary
          ? "id, slug, title, excerpt, image, categories, start_date, location, people_helped, status, created_at, updated_at"
          .replace(/\s+/g, ' ')
          : "id, slug, title, excerpt, image, categories, start_date, location, people_helped, status, content, goals, gallery, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: projects, error } = await query;

    console.log('[DEBUG] getProjects: Query result:', {
      error,
      projectsCount: projects?.length,
      projects: projects?.map(p => ({ id: p.id, title: p.title, slug: p.slug }))
    });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    // Supabase already parses JSON fields, no need for manual JSON.parse
    console.log('[DEBUG] getProjects: Returning projects array with length:', projects?.length || 0);
    return projects;
  } catch (error) {
    console.error("Unexpected error loading projects:", error);
    return [];
  }
}

/**
 * Get a single project by slug
 * @param {string} slug
 * @returns {Project|null}
 */
export async function getProject(slug) {
  // Fallback if Supabase admin client is not available
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not available, cannot fetch project by slug - check SUPABASE_SERVICE_ROLE_KEY environment variable");
    return null;
  }

  try {
    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.error('Invalid slug parameter:', { slug, type: typeof slug, isEmpty: slug === '' });
      return null;
    }

    console.log('[DEBUG] getProject: Starting database query for slug:', slug);

    // Add timeout configuration to the query
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('[DEBUG] getProject: Query result:', {
      error: error ? { message: error.message, code: error.code, details: error.details, hint: error.hint } : null,
      projectFound: !!project,
      projectId: project?.id,
      projectTitle: project?.title
    });

    if (error) {
      console.error('Supabase error fetching project by slug:', {
        slug,
        error: error.message || error,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    if (!project) {
      console.log('No project found with slug:', slug);
      return null;
    }

    console.log('Successfully fetched project:', { id: project.id, title: project.title, slug: project.slug });
    return project;
  } catch (error) {
    console.error('Unexpected error in getProject:', {
      slug,
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return null;
  }
}

/**
 * Get a single project by ID
 * @param {string} id
 * @returns {Project|null}
 */
export async function getProjectById(id) {
  // Fallback if Supabase admin client is not available
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not available, cannot fetch project by ID - check SUPABASE_SERVICE_ROLE_KEY environment variable");
    return null;
  }

  try {
    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !project) {
      console.error("Error fetching project by ID:", error);
      return null;
    }

    // Supabase already parses JSON fields, no need for manual JSON.parse
    return project;
  } catch (error) {
    console.error("Unexpected error loading project by ID:", error);
    return null;
  }
}

/**
 * Add a new project to database
 * @param {Project} project
 */
export async function addProject(project) {
  // Fallback if Supabase admin client is not available
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not available, cannot add project - check SUPABASE_SERVICE_ROLE_KEY environment variable");
    throw new Error("Database client not available");
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        id: project.id,
        slug: project.slug,
        title: project.title,
        excerpt: project.excerpt,
        image: project.image,
        categories: project.categories || [],
        start_date: project.startDate,
        location: project.location,
        people_helped: project.peopleHelped,
        status: project.status,
        content: project.content || [],
        goals: project.goals || [],
        gallery: project.gallery || [],
        created_at: project.createdAt,
        updated_at: project.createdAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding project:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

/**
 * Update an existing project in database
 * @param {string} id
 * @param {Project} updatedProject
 */
export async function updateProject(id, updatedProject) {
  // Fallback if Supabase admin client is not available
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not available, cannot update project - check SUPABASE_SERVICE_ROLE_KEY environment variable");
    throw new Error("Database client not available");
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .update({
        slug: updatedProject.slug,
        title: updatedProject.title,
        excerpt: updatedProject.excerpt,
        image: updatedProject.image,
        categories: updatedProject.categories || [],
        start_date: updatedProject.startDate,
        location: updatedProject.location,
        people_helped: updatedProject.peopleHelped,
        status: updatedProject.status,
        content: updatedProject.content || [],
        goals: updatedProject.goals || [],
        gallery: updatedProject.gallery || [],
        updated_at: updatedProject.updatedAt,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

/**
 * Delete a project by ID
 * @param {string} id
 */
export async function deleteProject(id) {
  // Fallback if Supabase admin client is not available
  if (!supabaseAdmin) {
    console.warn("Supabase admin client not available, cannot delete project - check SUPABASE_SERVICE_ROLE_KEY environment variable");
    throw new Error("Database client not available");
  }

  try {
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

/**
 * Generate a unique ID for a project
 * @returns {string}
 */
export function generateProjectId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Get projects summary data excluding large JSONB fields for list views
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of projects to return (default: 50)
 * @param {number} options.offset - Number of projects to skip (default: 0)
 * @returns {Project[]} Array of project summaries
 */
export async function getProjectsSummary(options = {}) {
  return getProjects({ ...options, summary: true });
}

/**
 * Generate a slug from title
 * @param {string} title
 * @returns {string}
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .trim();
}
