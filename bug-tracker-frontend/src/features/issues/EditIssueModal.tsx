import { useState } from "react";
import type { Issue } from "./KanbanBoard";
import { updateIssue } from "./issues.api";

import { mockUsers } from "../users/mockUsers";

interface Props {
  issue: Issue;
  onClose: () => void;
  onUpdated: (issue: Issue) => void;
}

export default function EditIssueModal({
  issue,
  onClose,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(
    issue.description ?? ""
  );
  const [priority, setPriority] = useState(issue.priority);

  const [assigneeId, setAssigneeId] = useState<string>(
    issue.assigneeId ?? ""
  );

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateIssue(issue.id, {
        title,
        description,
        priority,
        assigneeId: assigneeId || null,
      });

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">Edit Issue</h2>

        <input
          className="w-full border p-2 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* ✅ Assignee dropdown */}
        <select
          className="w-full border p-2 mb-4"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {mockUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={saving}
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
