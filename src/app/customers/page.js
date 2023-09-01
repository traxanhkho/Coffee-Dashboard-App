"use client";
import { useState, useEffect } from "react";
import Table from "@/components/common/Table/index.jsx";
import { getCustomers } from "@/services/customerService";
import Layouts from "@/components/Layouts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Zoom, toast } from "react-toastify";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const handleGetDataFromServer = async () => {
    setCustomers(await getCustomers());
  };

  useEffect(() => {
    handleGetDataFromServer();
  }, []);

  function getAddressCustomer(address) {
    let addressNames = [];
    const addressKeys = Object.keys(address);

    addressKeys.forEach((key) => {
      const value = address[key];
      if (value && key !== "street") {
        addressNames.push(value.name);
      } else {
        addressNames.push(value);
      }
    });

    let addressNamesString = addressNames.join(", ");
    return addressNamesString;
  }

  const handleRemoveCustomerData = () => {
    const loading = toast.loading("Đang xóa dữ liệu...", {
      position: toast.POSITION.TOP_RIGHT,
    });

    setTimeout(() => {
      toast.update(loading, {
        render: "Tài khoản không được cấp phép.",
        type: "warning",
        isLoading: false,
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }, 1200);
  };

  const columns = [
    {
      path: "name",
      label: "Khách hàng",
      content: (customer) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {customer.name || "Chưa cập nhật"}
            </div>
          </div>
        </div>
      ),
    },
    {
      path: "address",
      label: "Địa chỉ",
      content: (customer) => (
        <p className="max-w-[480px] truncate">
          {(customer.address && getAddressCustomer(customer.address)) ||
            "Chưa cập nhật"}
        </p>
      ),
    },
    {
      path: "numberPhone",
      label: "Số điện thoại",
      content: (customer) => (
        <CopyToClipboard
          // text={this.state.value}
          text={customer.numberPhone}
          className="hover:text-orange-600 cursor-pointer"
          onCopy={() => {
            toast.info("Đã copy số điện thoại.", {
              position: "top-right",
              autoClose: 1000,
              transition: Zoom,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }}
        >
          <span>{customer.numberPhone}</span>
        </CopyToClipboard>
      ),
    },

    {
      key: "remove",
      content: (customer) => (
        <button
          type="button"
          onClick={() => handleRemoveCustomerData()}
          className="text-red-600 hover:text-red-800 border-none"
        >
          Xóa <span className="sr-only">, {customer.name}</span>
        </button>
      ),
    },
  ];

  return (
    <Layouts>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Danh sách khách hàng
            </h1>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="xs:-my-2 xs:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table columns={columns} data={customers} />
                {/* <Pagination /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
