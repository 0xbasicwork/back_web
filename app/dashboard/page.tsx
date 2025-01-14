import { OverBackIndex } from '@/components/dashboard/OverBackIndex';
import Footer from '@/app/components/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-2 md:p-4">
        <OverBackIndex />
      </main>
      <Footer />
    </div>
  );
}
