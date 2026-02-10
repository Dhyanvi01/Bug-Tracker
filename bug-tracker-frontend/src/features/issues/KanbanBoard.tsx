import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import Column from "./Column";
import CreateIssueModal from "./CreateIssueModal";
import EditIssueModal from "./EditIssueModal";
import { fetchIssues, updateIssueStatus } from "./issues.api";

import type { Project } from "../projects/project.types";
import { mockProjects } from "../projects/mockProjects";

/* ================= TYPES ================= */

export type Status = "backlog" | "todo" | "inprogress" | "done";

export interface Issue {
  id: string;
  title: string;
  status: Status;
  priority: string;
  description?: string | null;
  projectId: string;
  assigneeId?: string | null;
}

/* ================= CONSTANTS ================= */

const columns: { id: Status; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

/* ================= COMPONENT ================= */

export default function KanbanBoard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingIssue, setEditingIssue] =
    useState<Issue | null>(null);

  /* ================= FETCH ISSUES ================= */

  useEffect(() => {
    fetchIssues()
      .then(setIssues)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= DRAG & DROP ================= */

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as Status;

    // optimistic update
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, status: newStatus } : i
      )
    );

    try {
      await updateIssueStatus(issueId, newStatus);
    } catch (err) {
      console.error(err);
    }
  }

  /* ================= FILTER ================= */

  const visibleIssues = selectedProject
    ? issues.filter((i) => i.projectId === selectedProject.id)
    : [];

  if (loading) {
    return <div className="p-6">Loading issues…</div>;
  }

  /* ================= RENDER ================= */

  return (
    <>
      {/* ================= BOARD (DnD ONLY) ================= */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-6 max-w-[1600px] mx-auto">

          {/* HEADER */}
          <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Bug Tracker
                </h1>
                <p className="text-sm text-gray-500">
                  Track, assign and manage issues
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
              >
                + New Issue
              </button>
            </div>

            {/* PROJECT SELECTOR */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                Project
              </span>

              <select
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={selectedProject?.id ?? ""}
                onChange={(e) => {
                  const project =
                    mockProjects.find(
                      (p) => p.id === e.target.value
                    ) || null;
                  setSelectedProject(project);
                }}
              >
                <option value="">Select Project</option>
                {mockProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>

              {selectedProject && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {selectedProject.key}
                </span>
              )}
            </div>
          </div>

          {/* KANBAN */}
          {!selectedProject ? (
            <div className="text-center text-gray-400 mt-24 text-lg">
              Select a project to start working 🚀
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {columns.map((col) => (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  issues={visibleIssues.filter(
                    (i) => i.status === col.id
                  )}
                  onEdit={setEditingIssue}
                />
              ))}
            </div>
          )}
        </div>
      </DndContext>

      {/* ================= CREATE ISSUE MODAL ================= */}
      {showCreateModal && selectedProject && (
        <CreateIssueModal
          projectId={selectedProject.id}
          onCreated={(issue) =>
            setIssues((prev) => [...prev, issue])
          }
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* ================= EDIT ISSUE MODAL ================= */}
      {editingIssue && (
        <EditIssueModal
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onUpdated={(updated) =>
            setIssues((prev) =>
              prev.map((i) =>
                i.id === updated.id ? updated : i
              )
            )
          }
        />
      )}
    </>
  );
}
