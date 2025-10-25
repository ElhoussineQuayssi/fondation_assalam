import { getStats } from "lib/actions";

export async function GET() {
  try {
    const result = await getStats();

    if (result.success) {
      return Response.json(result);
    } else {
      return Response.json(
        { success: false, message: result.message },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in stats API:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
