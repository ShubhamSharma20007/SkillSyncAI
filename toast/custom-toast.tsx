import { toast } from "sonner";
import { X } from "lucide-react";

type CustomToastProps = {
  content: string;
  duration?: number;
};

export const customToast = ({ content, duration }: CustomToastProps) =>
  toast.custom((t: any) => (
    <div
      className={`w-full max-w-sm dark:bg-white bg-black border border-border rounded-lg shadow-lg py-4 px-4 flex items-center justify-between transition-all ${
        t.visible
          ? "animate-in fade-in slide-in-from-top-5"
          : "animate-out fade-out slide-out-to-top-5"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium dark:text-black text-white">
          {content}
        </span>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="ml-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4 dark:text-black text-white" />
      </button>
    </div>
  ), {
    duration: duration || 4000,
    // position: "top-right",
  });
