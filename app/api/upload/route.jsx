import { NextResponse } from "next/server";
import path from "path";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "../../../lib/db";

export async function POST(request) {
  console.log("Upload API: Received POST request");
  console.log("Upload API: Request headers:", Object.fromEntries(request.headers.entries()));

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    console.log("Upload API: File received:", file ? { name: file.name, size: file.size, type: file.type } : "null");

    if (!file || !(file instanceof File)) {
      console.error("Upload API: No file uploaded.");
      return NextResponse.json(
        { error: "Aucun fichier téléchargé." },
        { status: 400 },
      );
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      console.log("Upload API: File type rejected:", file.type);
      return NextResponse.json(
        { error: "Seuls les fichiers image sont autorisés." },
        { status: 400 },
      );
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.log("Upload API: File size rejected:", file.size);
      return NextResponse.json(
        { error: "Le fichier est trop volumineux (max 5MB)." },
        { status: 400 },
      );
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const uniqueSuffix = Date.now() + "-" + randomBytes(16).toString("hex");
    const filename = `image-${uniqueSuffix}${ext}`;
    console.log("Upload API: Generated filename:", filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("Upload API: File converted to buffer, size:", buffer.length);

    // Upload to Supabase storage
    console.log("Upload API: Uploading to Supabase bucket 'blogs'");
    const { data, error } = await supabaseAdmin.storage
      .from('blogs')
      .upload(filename, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Upload API: Error uploading to Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors du téléchargement de l'image." },
        { status: 500 },
      );
    }

    console.log("Upload API: Supabase upload successful, data:", data);

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('blogs')
      .getPublicUrl(data.path);

    console.log("Upload API: Generated public URL:", publicUrlData.publicUrl);

    const response = NextResponse.json({ filePath: publicUrlData.publicUrl });
    console.log("Upload API: Response headers:", Object.fromEntries(response.headers.entries()));

    return response;
  } catch (error) {
    console.error("Upload API: Error uploading file:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléchargement de l'image." },
      { status: 500 },
    );
  }
}
