function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Navegación de páginas" className="my-4">
      <ul className="pagination justify-content-center align-items-center gap-1">
        {/* Botón anterior */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-link shadow-sm d-flex align-items-center gap-1"
          >
            <i className="bi bi-chevron-left"></i>
            <span className="d-none d-sm-inline">Anterior</span>
          </button>
        </li>

        {/* Botones de números */}
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${pageNumber === currentPage ? "active" : ""}`}
          >
            <button
              onClick={() => onPageChange(pageNumber)}
              disabled={pageNumber === currentPage}
              className="page-link shadow-sm"
            >
              {pageNumber}
            </button>
          </li>
        ))}

        {/* Botón siguiente */}
        <li
          className={`page-item ${
            totalPages === 0 || currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={totalPages === 0 || currentPage === totalPages}
            className="page-link shadow-sm d-flex align-items-center gap-1"
          >
            <span className="d-none d-sm-inline">Siguiente</span>
            <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
