import { Suspense } from "react";
import { BarLoader } from "react-spinners";
export default function AiPreparationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 w-full">
      <Suspense
        fallback={
          <div className="fixed inset-0 flex justify-center items-center  z-50">
            <BarLoader color="gray" width={'50%'} loading={true} />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
