import Button from "./Button";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginationProps {
  page: number;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted sm:text-sm">
        <span className="sm:hidden">{meta.page}/{meta.totalPages}</span>
        <span className="hidden sm:inline">Page {meta.page} of {meta.totalPages} ({meta.total} total)</span>
      </p>
      <div className="flex gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= meta.totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
