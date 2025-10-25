const ContentGrid = ({ items, columns, renderItem, className = "" }) => {
  const columnClasses = `grid grid-cols-${columns.default} ${
    columns.md ? `md:grid-cols-${columns.md}` : ""
  } ${columns.lg ? `lg:grid-cols-${columns.lg}` : ""} gap-8`;

  return (
    <div className={`p-4 ${columnClasses} ${className}`}>
      {items.map((item, index) =>
        renderItem ? renderItem(item, index) : null,
      )}
    </div>
  );
};

export default ContentGrid;
