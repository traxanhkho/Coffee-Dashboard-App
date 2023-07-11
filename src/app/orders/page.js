"use client";
import { useState, useEffect } from "react";
import Link from "next/link.js";
import FilterProducts from "@/components/FilterProducts.js";
import Btn from "@/components/common/Btn.js";
import Table from "@/components/common/Table/index.jsx";
import { useForm } from "react-hook-form";
import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "@/services/orderServices";
import OrderForm from "@/components/OrderForm";
import { toast } from "react-toastify";
import Layouts from "@/components/Layouts";

export default function Orders() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState([
    {
      value: "pending",
      name: "Chờ xử lý",
      selected: true,
    },
    {
      value: "processing",
      name: "Đang xử lý",
      selected: false,
    },
    {
      value: "completed",
      name: "Đã hoàn thành",
      selected: false,
    },
    {
      value: "cancelled",
      name: "Đã hủy đơn",
      selected: false,
    },
  ]);

  const { register, handleSubmit, reset } = useForm();

  const handleGetDataFromServer = async () => {
    setOrders(await getOrders());
  };

  useEffect(() => {
    handleGetDataFromServer();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    setOrders(
      orders.map((order) =>
        order._id === orderId ? { ...order, removing: true } : order
      )
    );
    setTimeout(async () => {
      const orderDeleted = await deleteOrder(orderId);
      if (orderDeleted)
        setOrders(orders.filter((order) => order._id !== orderDeleted._id));
    }, 500);
  };

  const handleUpdateOrderStatus = async (status, orderId) => {
    const orderUpdated = await updateOrderStatus(status, orderId);
    setOpen(false);

    const updatedOrders = orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, status: orderUpdated.status };
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  const getProductNames = (products) => {
    // Create an empty array to store the product names
    let productNames = [];
    // productNames.push(products[0].name);

    // Iterate over the products and extract the product names
    for (let i = 0; i < products.length; i++) {
      let productName = products[i].productId.name;
      productNames.push(productName);
    }

    // Convert the array of product names to a string
    let productNamesString = productNames.join(", ");

    // Return the string of product names
    return productNamesString;
  };

  // Function to retrieve topping names
  const getToppingNames = (data) => {
    let toppingNames = [];

    // Iterate over the products
    for (let i = 0; i < data.products.length; i++) {
      let product = data.products[i];

      // Iterate over the toppings of each product
      for (let j = 0; j < product.toppings.length; j++) {
        let topping = product.toppings[j];

        // Add the topping name to the toppingNames array
        toppingNames.push(topping.toppingId.name);
      }
    }

    let toppingNamesString = toppingNames.join(", ");

    return toppingNamesString;
  };

  const getAddressCustomer = (address) => {
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
  };

  const getStatusName = (status) => {
    switch (status) {
      case "pending":
        return (
          <p className="px-2 font-medium  rounded-3xl text-center text-yellow-800 bg-yellow-400">
            Chờ xử lý
          </p>
        );
      case "processing":
        return (
          <p className="px-2 font-medium  rounded-3xl text-center text-blue-800 bg-blue-400">
            Đang xử lý
          </p>
        );
      case "completed":
        return (
          <p className="px-2 font-medium  rounded-3xl text-center text-green-800 bg-green-400">
            Đã hoàn thành
          </p>
        );
      case "cancelled":
        return (
          <p className="px-2 font-medium  rounded-3xl text-center text-red-800 bg-red-400">
            Đã hủy đơn
          </p>
        );
      default:
        return <p>Không xác định</p>;
    }
  };

  const columns = [
    {
      path: "name",
      label: "Khách hàng",
      content: (order) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium max-w-[240px] truncate text-gray-900">
              {order.customerId.name}
            </div>
            <div className="text-gray-500 max-w-[240px] truncate">
              {getAddressCustomer(order.customerId.address)}
            </div>
          </div>
        </div>
      ),
    },
    {
      path: "product",
      label: "Sản phẩm",
      content: (order) => (
        <div className="flex items-center">
          <div>
            <div className="font-normal max-w-[240px] truncate text-gray-900">
              {getProductNames(order.products)}
            </div>
            <div className="text-gray-500 max-w-[240px] truncate">
              {getToppingNames(order)}
            </div>
          </div>
        </div>
      ),
    },
    {
      path: "quantity",
      label: "Số lượng",
      content: (order) => <p>{order.products.length}</p>,
    },
    {
      path: "status",
      label: "Trạng thái",
      content: (order) => getStatusName(order.status),
    },
    {
      key: "edit",
      content: (order) => (
        <button
          onClick={() => {
            setSelectedOrder(order);
            setOpen(true);
          }}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Chi tiết
        </button>
      ),
    },
    {
      key: "remove",
      content: (order) => (
        <button
          type="button"
          onClick={() => handleDeleteOrder(order._id)}
          className="text-red-600 hover:text-red-800 border-none"
        >
          Xóa <span className="sr-only">, {order.customerId.name}</span>
        </button>
      ),
    },
  ];

  const onSubmitFormOrder = async ({ status }) => {
    if (!status || status === selectedOrder.status) {
      setOpen(false);
      return toast.warning(`Trạng thái không chính xác!`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1600,
        className: "custom-toast",
      });
    }

    if (selectedOrder) {
      handleUpdateOrderStatus(status, selectedOrder._id);
    }
  };

  return (
    <Layouts>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Danh sách đơn hàng
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <OrderForm
              open={open}
              setOpen={setOpen}
              resetForm={reset}
              status={status}
              onSubmit={handleSubmit(onSubmitFormOrder)}
              selectedOrder={selectedOrder}
              register={register}
            />
          </div>
        </div>
        <FilterProducts />
        <div className="mt-8 flex flex-col">
          <Table columns={columns} data={orders} />
        </div>
      </div>
    </Layouts>
  );
}
