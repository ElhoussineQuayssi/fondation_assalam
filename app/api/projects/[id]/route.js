import { getProjectById } from "lib/projects";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "ID du projet requis" },
        { status: 400 },
      );
    }

    const result = await getProjectById(id);

    if (!result) {
      return Response.json(
        { success: false, message: "Projet non trouvé" },
        { status: 404 },
      );
    }

    return Response.json(result);
  } catch {
    return Response.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 },
    );
  }
}
