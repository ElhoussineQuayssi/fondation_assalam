# Enhanced Hooks Documentation

This document outlines the custom hooks available in the Fondation Assalam project and how to use them effectively.

## 📂 Available Hooks

### Core Utility Hooks (`use-enhanced.tsx`)

#### `useLocalStorage(key, initialValue)`

Persistent state management with localStorage and SSR support.

```tsx
function UserPreferences() {
  const [preferences, setPreferences] = useLocalStorage("userPrefs", {
    language: "fr",
    notifications: true,
  });

  return (
    <div>
      <label>
        Language:
        <select
          value={preferences.language}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              language: e.target.value,
            })
          }
        >
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </label>
    </div>
  );
}
```

#### `useApi(url, options?)`

Simplified API calls with loading states and error handling.

```tsx
function ProjectList() {
  const { data: projects, loading, error, refetch } = useApi("/api/projects");

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <Button onClick={refetch}>Refresh</Button>
    </div>
  );
}
```

#### `useDebounce(value, delay)`

Debounce values for search inputs and API calls.

```tsx
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: results } = useApi(`/api/search?q=${debouncedSearch}`);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search projects..."
      />
      {debouncedSearch && <SearchResults results={results} />}
    </div>
  );
}
```

#### `useForm(initialValues, validate?)`

Complete form state management with validation.

```tsx
function ContactForm() {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    { name: "", email: "", message: "" },
    (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) errors.email = "Email is required";
      return errors;
    },
  );

  const onSubmit = async (formData) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    // Handle response
  };

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)}>
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
      />
      <Textarea
        label="Message"
        value={values.message}
        onChange={(e) => handleChange("message", e.target.value)}
      />
      <Button type="submit" loading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
}
```

#### `useIntersectionObserver(ref, options?)`

Detect when elements enter the viewport for animations and lazy loading.

```tsx
function AnimatedSection({ children }) {
  const ref = useRef();
  const isVisible = useIntersectionObserver(ref);

  return (
    <section
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </section>
  );
}
```

#### `useMediaQuery(query)`

Responsive design beyond mobile detection.

```tsx
function ResponsiveComponent() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  return (
    <div
      className={`
      ${isLargeScreen ? "grid-cols-4" : ""}
      ${isTablet ? "grid-cols-2" : ""}
      ${!isTablet && !isLargeScreen ? "grid-cols-1" : ""}
    `}
    >
      {/* Content */}
    </div>
  );
}
```

#### `usePrevious(value)`

Compare current and previous values.

```tsx
function ValueChangeDetector({ value }) {
  const previousValue = usePrevious(value);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      console.log(`Value changed from ${previousValue} to ${value}`);
    }
  }, [value, previousValue]);

  return <div>Current: {value}</div>;
}
```

#### `useAsync(asyncFunction, dependencies?)`

Handle async operations with proper cleanup.

```tsx
function DataFetcher() {
  const { data, loading, error } = useAsync(
    () => fetch("/api/data").then((res) => res.json()),
    [], // Dependencies
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return <DataDisplay data={data} />;
}
```

### Project-Specific Hooks (`use-project.tsx`)

#### `useAuth()`

Authentication state management.

```tsx
function ProtectedComponent() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      Welcome, {user.name}!<Button onClick={logout}>Logout</Button>
    </div>
  );
}
```

#### `useProjects()`

Complete CRUD operations for projects.

```tsx
function ProjectManager() {
  const { projects, loading, createProject, updateProject, deleteProject } =
    useProjects();
  const [editingProject, setEditingProject] = useState(null);

  const handleCreate = async (projectData) => {
    const result = await createProject(projectData);
    if (result.success) {
      // Success feedback
    }
  };

  return (
    <div>
      <ProjectForm onSubmit={handleCreate} />
      <ProjectList
        projects={projects}
        onEdit={setEditingProject}
        onDelete={deleteProject}
      />
    </div>
  );
}
```

#### `useBlogs()`

Blog management with filtering and pagination.

```tsx
function BlogManager() {
  const { blogs, loading, fetchBlogs } = useBlogs();
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchBlogs(selectedCategory);
  }, [selectedCategory, fetchBlogs]);

  return (
    <div>
      <CategoryFilter
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />
      <BlogList blogs={blogs} loading={loading} />
    </div>
  );
}
```

#### `useMessages()`

Message management with real-time updates.

```tsx
function Inbox() {
  const { messages, unreadCount, markAsRead } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className="flex">
      <MessageList
        messages={messages}
        unreadCount={unreadCount}
        onSelect={setSelectedMessage}
        onMarkRead={markAsRead}
      />
      {selectedMessage && <MessageDetail message={selectedMessage} />}
    </div>
  );
}
```

### Admin Hooks (`use-admin.tsx`)

#### `useStats()`

Dashboard statistics with real-time updates.

```tsx
function Dashboard() {
  const { stats, loading, error, refresh } = useStats();

  return (
    <div>
      <StatsCards stats={stats} />
      <div className="mt-8">
        <Button onClick={refresh}>Refresh Data</Button>
      </div>
    </div>
  );
}
```

#### `useAdmins()`

Admin user management.

```tsx
function AdminManager() {
  const { admins, createAdmin, updateAdmin, deleteAdmin } = useAdmins();

  const handleCreateAdmin = async (adminData) => {
    const result = await createAdmin(adminData);
    if (result.success) {
      // Success feedback
    }
  };

  return (
    <div>
      <AdminForm onSubmit={handleCreateAdmin} />
      <AdminTable
        admins={admins}
        onUpdate={updateAdmin}
        onDelete={deleteAdmin}
      />
    </div>
  );
}
```

#### `usePagination(totalItems, itemsPerPage?)`

Pagination logic and controls.

```tsx
function PaginatedList({ items }) {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    getVisiblePages,
  } = usePagination(items.length, 10);

  const paginatedItems = items.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div>
      <ItemList items={paginatedItems} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        visiblePages={getVisiblePages()}
      />
    </div>
  );
}
```

#### `useSearch(initialQuery?, delay?)`

Search functionality with debouncing.

```tsx
function SearchableList() {
  const { query, debouncedQuery, setQuery, clearSearch } = useSearch();

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} onClear={clearSearch} />
      <ItemList items={filteredItems} />
    </div>
  );
}
```

#### `useTheme()`

Theme management with persistence.

```tsx
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</Button>
  );
}
```

## 🚀 Implementation Examples

### Enhanced Admin Dashboard

```tsx
function EnhancedDashboard() {
  const { stats, loading } = useStats();
  const { user, logout } = useAuth();
  const { messages, unreadCount } = useMessages();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <DashboardHeader user={user} onLogout={logout} />
      <StatsOverview stats={stats} />
      <RecentActivity messages={messages} unreadCount={unreadCount} />
    </div>
  );
}
```

### Enhanced Project Management

```tsx
function EnhancedProjectManager() {
  const { projects, createProject, loading } = useProjects();
  const { query, setQuery } = useSearch();

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <ProjectSearch value={query} onChange={setQuery} />
      <ProjectGrid projects={filteredProjects} loading={loading} />
      <CreateProjectModal onSubmit={createProject} />
    </div>
  );
}
```

## 🎯 Benefits of Using These Hooks

1. **Code Reusability**: Common functionality extracted into reusable hooks
2. **Better Performance**: Optimized re-renders and memory management
3. **Type Safety**: Full TypeScript support with proper typing
4. **Error Handling**: Consistent error handling across components
5. **Loading States**: Unified loading state management
6. **Responsive Design**: Better responsive behavior with media query hooks
7. **Real-time Updates**: Live data updates for admin features
8. **Form Management**: Simplified form handling with validation
9. **Search & Filter**: Built-in search and pagination logic
10. **Authentication**: Centralized auth state management

## 📋 Migration Guide

To implement these hooks in existing components:

1. **Replace direct API calls** with `useApi` or project-specific hooks
2. **Replace localStorage logic** with `useLocalStorage`
3. **Add search functionality** using `useSearch` and `useDebounce`
4. **Implement form handling** with `useForm`
5. **Add loading states** using the loading properties from hooks
6. **Implement pagination** with `usePagination`
7. **Add theme support** using `useTheme`

These hooks will significantly improve code organization, reduce duplication, and enhance the overall user experience of the Fondation Assalam project! 🌟
