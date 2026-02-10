import { NavLink } from "react-router-dom";

const linkClass =
  "block px-4 py-2 rounded hover:bg-gray-200 text-gray-700";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 font-bold text-lg">Bug Tracker</div>

      <nav className="space-y-1 px-2">
        <NavLink
          to="/issues"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-200 font-medium" : ""}`
          }
        >
          Issues
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-200 font-medium" : ""}`
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-200 font-medium" : ""}`
          }
        >
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
