import { OverBackIndex } from '@/components/dashboard/OverBackIndex';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <OverBackIndex />
        </div>
        {/* Add other dashboard components here */}
      </div>
    </div>
  );
}
