import { CalendarDays } from "lucide-react";

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <CalendarDays size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
