import { Card } from "@/components/ui/card";

interface LessonNotesProps {
  notes: string;
}

export function LessonNotes({ notes }: LessonNotesProps) {
  const formattedNotes = notes.split("\n").map((line, index) => {
    if (line.startsWith("-") || /^\d+\./.test(line)) {
      return (
        <li key={index} className="ml-4 text-muted-foreground">
          {line.replace(/^[-•]\s/, "").replace(/^\d+\.\s/, "")}
        </li>
      );
    }
    if (line.trim() === "") return null;
    return (
      <p key={index} className="font-semibold text-foreground">
        {line}
      </p>
    );
  });

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-xl font-bold text-foreground mb-4">Lesson Notes</h3>
      <div className="space-y-2 text-sm">{formattedNotes}</div>
    </Card>
  );
}
