import { useDroppable } from "@dnd-kit/core";
import IssueCard from "./IssueCard";
import type { Issue, Status } from "./KanbanBoard";

interface ColumnProps {
  id: Status;
  title: string;
  issues: Issue[];
  onEdit: (issue: Issue) => void; // ✅ NEW
}

export default function Column({
  id,
  title,
  issues,
  onEdit,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-4 min-h-[400px] transition-colors ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h2 className="font-semibold mb-4">{title}</h2>

      <div className="space-y-3">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => onEdit(issue)} // ✅ CLICK HANDLER
          />
        ))}
      </div>
    </div>
  );
}
