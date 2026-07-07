import { type ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  maxWidth?: "sm" | "md" | "lg";
  zIndex?: "50" | "60";
}

const maxWidthClass = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
};

export default function Modal({
  children,
  onClose,
  maxWidth = "md",
  zIndex = "50",
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      style={{ zIndex: zIndex === "60" ? 60 : 50 }}
      onClick={onClose}
    >
      <div
        className={`my-auto w-full ${maxWidthClass[maxWidth]} max-h-[calc(100dvh-2rem)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
