const AdminLoginForm = ({ error, isLoading, onSubmit }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm scroll-reveal">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "#333333" }}>
          Accès Administration
        </h1>
        <p className="text-gray-600">Connectez-vous pour continuer</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="email"
            style={{ color: "#333333" }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 shadow-sm"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="password"
            style={{ color: "#333333" }}
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-dark-text transition duration-150 text-lg shadow-sm"
            autoComplete="current-password"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform shadow-xl hover:scale-[1.01] hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#6495ED" }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AdminLoginForm;
