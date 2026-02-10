import { useState } from "react";

interface Project {
  id: number;
  name: string;
  key: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  const handleCreate = () => {
    if (!name || !key) return;

    setProjects([
      ...projects,
      { id: Date.now(), name, key },
    ]);

    setName("");
    setKey("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {/* Create Project */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-md">
        <h2 className="font-medium mb-2">Create Project</h2>

        <input
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="Project Key (e.g. BUG)"
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <span>
              {p.name} <span className="text-gray-500">({p.key})</span>
            </span>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-gray-500">No projects yet</p>
        )}
      </div>
    </div>
  );
}
