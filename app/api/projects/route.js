import { getProjects, getProjectsSummary } from "@/lib/projects";
import { cache, CACHE_KEYS } from "@/lib/cache";

export async function GET(request) {
  try {
    console.log('[DEBUG] /api/projects: Starting GET request');

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const summary = searchParams.get('summary') === 'true';

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return Response.json(
        { success: false, message: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return Response.json(
        { success: false, message: "Offset must be non-negative" },
        { status: 400 }
      );
    }

    // Create cache key based on parameters
    const cacheKey = summary
      ? `${CACHE_KEYS.PROJECTS_SUMMARY}:${limit}:${offset}`
      : `${CACHE_KEYS.PROJECTS_LIST}:${limit}:${offset}`;

    // Try to get from cache first
    let projects = cache.get(cacheKey);

    if (projects) {
      console.log('[DEBUG] /api/projects: Cache hit for key:', cacheKey);
    } else {
      console.log('[DEBUG] /api/projects: Cache miss for key:', cacheKey);
      // Fetch from database
      projects = summary
        ? await getProjectsSummary({ limit, offset })
        : await getProjects({ limit, offset });

      // Cache the result (5 minutes TTL)
      cache.set(cacheKey, projects, 5 * 60 * 1000);
    }

    console.log('[DEBUG] /api/projects: Returning projects:', {
      count: projects?.length,
      limit,
      offset,
      summary,
      cached: !!cache.get(cacheKey),
      projects: projects?.map(p => ({ id: p.id, title: p.title, slug: p.slug }))
    });

    // Add cache headers to response
    const response = Response.json({
      projects,
      pagination: {
        limit,
        offset,
        hasMore: projects.length === limit
      }
    });

    // Set cache control headers
    response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    response.headers.set('X-Cache-Status', cache.get(cacheKey) ? 'HIT' : 'MISS');

    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json(
      { success: false, message: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}