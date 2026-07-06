import Button from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-3 sm:p-4">
      <Card className="w-full max-w-md rounded-b-none sm:rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 sm:gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive sm:h-5 sm:w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <p className="text-sm text-muted">{description}</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={loading}>
              {loading ? "Please wait..." : confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
