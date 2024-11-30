function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination justify-content-center">
        {/* Botón anterior */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-link"
          >
            Anterior
          </button>
        </li>
        {/* Botones de números */}
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              pageNumber === currentPage ? "active" : ""
            }`}
          >
            <button
              onClick={() => onPageChange(pageNumber)}
              disabled={pageNumber === currentPage}
              className="page-link"
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
            className="page-link"
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
