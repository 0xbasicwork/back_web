import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import { OverBackIndex } from '@/components/dashboard/OverBackIndex';

export default function DashboardPage() {
  return (
    <>
      <NavBar />
      <div className="pt-24 md:pt-32">
        <div className="container mx-auto p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <OverBackIndex />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
