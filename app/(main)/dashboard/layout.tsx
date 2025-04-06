import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 w-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-6xl gradient-title font-bold">Dashboard</h1>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <BarLoader color="gray"  width={'50%'} loading={true}/>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
