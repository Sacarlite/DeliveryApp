import  './css/Pagination.css';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
              <div className="pagination-container">
                <div className="pagination-bar">
                    <span
                        className="pagination-first"
                        onClick={() => setCurrentPage(1)}
                        aria-label="First page"
                    >
                        <i className="fas fa-angle-double-left"></i>
                    </span>

                    <span
                        className="pagination-prev"
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        aria-label="Previous page"
                    >
                        <i className="fas fa-angle-left"></i>
                    </span>

                    {pageNumbers.map((page) => (
                        <span
                            key={page}
                            className={`pagination-item ${page === currentPage ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                            aria-label={`Page ${page}`}
                        >
                            {page}
                        </span>
                    ))}

                    <span
                        className="pagination-next"
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        aria-label="Next page"
                    >
                        <i className="fas fa-angle-right"></i>
                    </span>

                    <span
                        className="pagination-last"
                        onClick={() => setCurrentPage(totalPages)}
                        aria-label="Last page"
                    >
                        <i className="fas fa-angle-double-right"></i>
                    </span>
                </div>
                </div>
    );
};

export default Pagination;