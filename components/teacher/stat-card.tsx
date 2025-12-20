interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
