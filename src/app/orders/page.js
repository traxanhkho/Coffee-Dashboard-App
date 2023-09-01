"use client";
import { useState, useEffect } from "react";
import Link from "next/link.js";
import FilterProducts from "@/components/FilterProducts.js";
import Btn from "@/components/common/Btn.js";
import Table from "@/components/common/Table/index.jsx";
import { FormProvider, useForm } from "react-hook-form";
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
  // const [status, setStatus] = useState([
  //   {
  //     value: "pending",
  //     name: "Chờ xử lý",
  //     selected: true,
  //   },
  //   {
  //     value: "processing",
  //     name: "Đang xử lý",
  //     selected: false,
  //   },
  //   {
  //     value: "completed",
  //     name: "Đã hoàn thành",
  //     selected: false,
  //   },
  //   {
  //     value: "cancelled",
  //     name: "Đã hủy đơn",
  //     selected: false,
  //   },
  // ]);

  const methods = useForm();

  const handleGetDataFromServer = async () => {
    const { orders } = await getOrders();
    setOrders(orders);
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
    if (!data) return "";
    let toppingNames = [];

    // Iterate over the products
    for (let i = 0; i < data.products.length; i++) {
      let product = data.products[i];

      // Iterate over the toppings of each product
      for (let j = 0; j < product.toppings.length; j++) {
        let topping = product.toppings[j];

        // Add the topping name to the toppingNames array
        toppingNames.push(topping.toppingId?.name);
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
    switch (status.step) {
      case 0:
        return (
          <p className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize  text-center text-blue-400 bg-blue-200">
            Đã đặt hàng
          </p>
        );
      case 1:
        return (
          <p className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize   text-center text-yellow-800 bg-yellow-400">
            Đang xử lý
          </p>
        );
      case 2:
        return (
          <p className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize   text-center text-blue-800 bg-blue-400">
            Đang vận chuyển
          </p>
        );
      case 4:
        return (
          <p className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize   text-center text-green-800 bg-green-400">
            Đã hoàn thành
          </p>
        );
      case 5:
        return (
          <p className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize  text-center text-red-800 bg-red-400">
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
        <div className="flex items-center ">
          <div>
            <div className="font-medium max-w-[240px] truncate text-gray-900">
              {order.orderShippingAddressInformation.name}
            </div>
            <div className="text-gray-500 max-w-[240px] truncate">
              {getAddressCustomer(
                order.orderShippingAddressInformation.address
              )}
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
            setSelectedOrder(order._id);
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
            <FormProvider {...methods}>
              <OrderForm
                open={open}
                setOpen={setOpen}
                setOrders={setOrders}
                orders={orders}
                onSubmit={onSubmitFormOrder}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
              />
            </FormProvider>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="xs:-my-2 xs:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table columns={columns} data={orders} />

                {/* <Pagination /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
