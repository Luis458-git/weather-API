/**
 * Header.jsx
 * Componente de encabezado de la aplicación.
 * Muestra el nombre, ícono de la app y un badge de estado.
 * Props: ninguna (es estático)
 */
const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Marca / Nombre de la aplicación */}
        <div className="header-brand">
          <span className="header-icon" aria-hidden="true">🌤️</span>
          <h1 className="header-title">
            Weather <span>Activity</span> Dashboard
          </h1>
        </div>

        {/* Badge de estado */}
        <span className="header-badge">⚡ En tiempo real</span>
      </div>
    </header>
  );
};

export default Header;
