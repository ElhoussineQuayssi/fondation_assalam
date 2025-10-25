export function migrate(db) {
  try {
    // Check if the 'image' column exists
    const columns = db.prepare("PRAGMA table_info(blog_posts)").all();
    const hasImageColumn = columns.some((col) => col.name === "image");

    if (!hasImageColumn) {
      db.prepare("ALTER TABLE blog_posts ADD COLUMN image TEXT").run();
    }

    // Check if the 'published_at' column exists
    const hasPublishedAtColumn = columns.some((col) => col.name === "published_at");

    if (!hasPublishedAtColumn) {
      db.prepare("ALTER TABLE blog_posts ADD COLUMN published_at DATETIME").run();
    }
  } catch (error) {
    console.error("Migration failed:", error);
    // For rollback, we would need to drop the added columns if they were added
    // But since this is additive and safe, we'll just log the error
    throw error;
  }
}
