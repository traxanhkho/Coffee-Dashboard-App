

export default function Pagination({ totalPages , data , handleNextPage , handlePrevPage }) {
  // { totalPages , data , handleNextPage , handlePrevPage }
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Đang hiển thị{" "}
          <span className="font-medium">
            {(data.page - 1) * data.limit + 1 || 0}
          </span>{" "}
          tới{" "}
          <span className="font-medium">
            {" "}
            {Math.min(data.page * data.limit, data.total) || 0}
          </span>{" "}
          sản phẩm của tổng số{" "}
          <span className="font-medium">{data.total || 0}</span> sản phẩm
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          className={`relative ${
            parseInt(data.page) - 1 < 1 ? "cursor-not-allowed" : ""
          } inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
          onClick={() => handlePrevPage()}
        >
          Trang trước
        </button>
        <button
          className={`relative ${
            parseInt(data.page) + 1 > totalPages ? "cursor-not-allowed" : ""
          } ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
          onClick={() => handleNextPage()}
        >
          Trang kế tiếp
        </button>
      </div>
    </nav>
  );
}
