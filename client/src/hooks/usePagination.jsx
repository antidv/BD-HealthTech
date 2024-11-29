import { useState } from "react";

function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const goToPage = (pageNumber) => {
    setPage((prev) =>
      Math.max(1, Math.min(pageNumber, Number.MAX_SAFE_INTEGER))
    );
  };

  return { page, setPage: goToPage };
}

export default usePagination;
