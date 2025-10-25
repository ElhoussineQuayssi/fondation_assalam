const AdminPageHeader = ({ title, subtitle, actionButton }) => (
  <div className="flex justify-between items-center mb-10 scroll-reveal">
    <div>
      <h1 className="text-4xl font-bold mb-1" style={{ color: "#333333" }}>
        {title}
      </h1>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </div>
    {actionButton}
  </div>
);

export default AdminPageHeader;
