
export default function Pagination() {
    return (
      <nav
        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Đang hiển thị <span className="font-medium">1</span> tới <span className="font-medium">10</span> sản phẩm của{' '}
            <span className="font-medium">20</span> sản phẩm
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Trang trước
          </a>
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Trang kế tiếp
          </a>
        </div>
      </nav>
    )
  }
  