type Props = {
  page: number;
  totalPages: number;
  isEmpty: boolean;
  disabled?: boolean;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, isEmpty, disabled = false, onChange }: Props) {
  const sinAnterior = disabled || isEmpty || page <= 1;
  const sinSiguiente = disabled || isEmpty || page >= totalPages;

  const btn =
    "rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Paginacion" className="mt-6 flex items-center justify-center gap-4">
      <button type="button" className={btn} disabled={sinAnterior} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span className="text-sm text-slate-600">
        Pagina {isEmpty ? 0 : page} de {totalPages}
      </span>
      <button type="button" className={btn} disabled={sinSiguiente} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </nav>
  );
}
