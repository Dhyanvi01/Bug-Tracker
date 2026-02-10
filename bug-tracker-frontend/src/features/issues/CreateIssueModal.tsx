import { useState } from "react";
import { createPortal } from "react-dom";
import { createIssue } from "./issues.api";
import type { Issue, Status } from "./KanbanBoard";

interface Props {
  projectId: string;
  onCreated: (issue: Issue) => void;
  onClose: () => void;
}

export default function CreateIssueModal({
  projectId,
  onCreated,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("backlog");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const issue = await createIssue({
        title,
        description,
        status,
        priority,
        project_id: projectId,
      });

      onCreated(issue);
      onClose();
    } catch (error) {
      console.error("Failed to create issue", error);
      alert("Failed to create issue");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 RENDER OUTSIDE DND USING PORTAL
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Create Issue
        </h2>

        <input
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            className="border rounded-lg p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            className="border rounded-lg p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
