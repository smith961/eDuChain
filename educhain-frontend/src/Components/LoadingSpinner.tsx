import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin text-blue`}>
          <Loader2 className="w-full h-full" />
        </div>
        <div
          className={`absolute inset-0 ${sizeClasses[size]} animate-ping text-blue opacity-20`}
        >
          <Loader2 className="w-full h-full" />
        </div>
      </div>
      {text && <p className="text-gray-600 text-sm mt-3 font-medium">{text}</p>}
    </div>
  );
}
