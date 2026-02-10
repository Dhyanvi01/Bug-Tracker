import { useDraggable } from "@dnd-kit/core";
import type { Issue } from "./KanbanBoard";
import { CSS } from "@dnd-kit/utilities";

import { mockUsers } from "../users/mockUsers";

interface Props {
  issue: Issue;
  onEdit: (issue: Issue) => void;
}

export default function IssueCard({ issue, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: issue.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const assignee = issue.assigneeId
    ? mockUsers.find((u) => u.id === issue.assigneeId)
    : null;

  const initials = assignee
    ? assignee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white p-3 rounded shadow cursor-grab"
      onDoubleClick={() => onEdit(issue)}
    >
      {/* Title */}
      <div className="font-medium">{issue.title}</div>

      {/* Priority */}
      <div className="text-xs text-gray-500 mt-1">
        Priority: {issue.priority}
      </div>

      {/* 👤 Assignee */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        {assignee ? (
          <>
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">
              {initials}
            </div>

            {/* Name */}
            <span className="text-gray-700">
              {assignee.name}
            </span>
          </>
        ) : (
          <span className="text-gray-400 italic">
            Unassigned
          </span>
        )}
      </div>
    </div>
  );
}
