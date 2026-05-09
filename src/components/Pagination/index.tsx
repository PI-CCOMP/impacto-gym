import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./styles.module.css";

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        {from}–{to} de {total}
      </span>

      <div className={styles.controls}>
        <label className={styles.sizeLabel}>
          Linhas por página:
          <select
            className={styles.sizeSelect}
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button
          className={styles.arrow}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          title="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <span className={styles.pages}>
          {page} / {totalPages}
        </span>

        <button
          className={styles.arrow}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          title="Próxima página"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
