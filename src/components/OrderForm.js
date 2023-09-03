import React, { useEffect, useState } from "react";
import Modal from "./common/Modal";
import Input from "./common/Input";
import Btn from "./common/Btn";
import _ from "lodash";
import SelectMenu from "./common/SelectMenu";
import {
  getOrder,
  getTotalAmount,
  updateOrderStatus,
} from "@/services/orderServices";
import { formatNumberInSeparateThousands } from "@/utils/formatNumberInSeparateThousands";
import { useFormContext } from "react-hook-form";
import Post from "./common/Post";
import PriceFormmater from "./common/PriceFormmater";
import {
  calculateTotalOrderPrice,
  calculateTotalProductPrice,
} from "@/utils/calculateTotalPriceOrders";
import OrderModal from "./OrderModal";
import { XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function OrderForm({
  open,
  setOpen,
  orders,
  setOrders,
  selectedOrder,
  setSelectedOrder,
}) {
  const [order, setOrder] = useState(null);

  const handleGetOrderByOrderId = async () => {
    try {
      if (selectedOrder) {
        const data = await getOrder(selectedOrder);
        setOrder(data);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    handleGetOrderByOrderId();
  }, [selectedOrder]);

  useEffect(() => {
    if (!open) {
      setOrder(null);
      setSelectedOrder(null);
    }
  }, [open]);

  const renderOrder = (products) => {
    const chunks = _.chunk(products, Math.ceil(products.length / 2)).slice(
      0,
      2
    );

    let ordinalNumber = 0;

    if(!products) return <p>loading....</p>

    return chunks.map((chunk, index) => (
      <div key={index}>
        {chunk.map((product) => {
          ordinalNumber++;
          return (
            <div key={product._id}>
              <div className="flex justify-between items-center">
                <p className="text-base">{`${
                  ordinalNumber < 10 ? `0${ordinalNumber}` : ordinalNumber
                }. ${product.productId?.name} x ${product.quantity}`}</p>
                <PriceFormmater
                  priceInVND={calculateTotalProductPrice(product) || 0}
                />
              </div>
              {product.note && (
                <p className="ml-4 text-xs text-gray-500">
                  *Lưu ý : {product.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  const handleUpdateStatus = async (step) => {
    if (!order) return;
    try {
      const data = await updateOrderStatus(order._id, step);

      if (data) {
        const updatedOrders = orders.map((item) => {
          if (item._id === order._id) {
            return { ...item, status: data.status };
          }
          return item;
        });

        setOrders(updatedOrders);
        setOrder((order) => ({ ...order, status: data.status }));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <OrderModal open={open} title="" setOpen={setOpen} buttonSave={false}>
      <div className="bg-gray-50 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-0 -top-[28px] hover:text-orange-600"
        >
          {" "}
          <XMarkIcon className="h-6 w-6" />{" "}
        </button>
        <div className="mx-auto mt-4">
          {/* Products */}
          <div className="">
            <h2 className="sr-only">Products purchased</h2>
            <div className="space-y-8">
              {order && (
                <div>
                  <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                    <div className="flex sm:items-baseline sm:space-x-4">
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Đơn hàng #{order._id}
                      </h1>
                    </div>
                    <div>
                      <Post createdAt={order.createdAt} />
                    </div>
                  </div>
                  <div className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                    <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      <div className=" lg:col-span-7">
                        <div className="mt-6 sm:mt-0">
                          <dt className="font-medium text-gray-900">
                            Danh sách sản phẩm
                          </dt>
                          <dd className="w-full grid grid-cols-1 sm:grid-cols-2 sm:gap-4 text-sm">
                            {renderOrder(order.products)}
                          </dd>
                        </div>
                      </div>

                      <div className="mt-6 lg:col-span-5 lg:mt-0">
                        <dl className="grid grid-cols-2 gap-x-6 text-sm">
                          <div>
                            <dt className="font-medium text-gray-900">
                              Hóa đơn
                            </dt>

                            <dd className="mt-2 flex-column text-black-400">
                              <p>Phí ship: 0đ</p>
                              <p>Phụ phí (thời tiết xấu): 0đ</p>
                              <h4 className="font-medium">
                                Tổng đơn hàng:{" "}
                                <PriceFormmater
                                  className={"inline"}
                                  priceInVND={
                                    calculateTotalOrderPrice(order) || 0
                                  }
                                />
                              </h4>
                            </dd>
                          </div>
                          <div>
                            <dt className="font-medium text-gray-900">
                              Thông tin giao hàng
                            </dt>
                            <dd className="mt-3 space-y-3 text-gray-500">
                              <span>
                                {
                                  order.orderShippingAddressInformation.address
                                    .city.name
                                }
                                ,{" "}
                              </span>
                              <span>
                                {
                                  order.orderShippingAddressInformation.address
                                    .district.name
                                }
                                ,{" "}
                              </span>
                              <span>
                                {
                                  order.orderShippingAddressInformation.address
                                    .ward.name
                                }
                                ,{" "}
                              </span>
                              <span>
                                {
                                  order.orderShippingAddressInformation.address
                                    .street
                                }
                              </span>
                              <p>
                                số liên hệ:{" "}
                                {
                                  order.orderShippingAddressInformation
                                    .numberPhone
                                }
                              </p>
                              <p>
                                Tên Khách hàng :{" "}
                                {order.orderShippingAddressInformation.name}
                              </p>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:p-8">
                      <h4 className="sr-only">Status</h4>
                      <p className="text-sm font-medium text-gray-900">
                        Trạng thái đơn hàng{" "}
                        <span className="text-xs">
                          (cập nhật trạng thái đơn hàng hãy click vào chữ bên
                          dưới)
                        </span>
                      </p>
                      <div className="mt-6" aria-hidden="true">
                        <div className="overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-indigo-600"
                            style={{
                              width: `calc((${order.status.step} * 2 + 1) / 8 * 100%)`,
                            }}
                          />
                        </div>
                        <div className="mt-6 hidden grid-cols-5 text-sm font-medium text-gray-600 sm:grid">
                          <div className="text-indigo-600">
                            <button
                              onClick={() => handleUpdateStatus(0)}
                              className="hover:text-orange-400"
                            >
                              Đã đặt hàng
                            </button>
                          </div>
                          <div
                            className={classNames(
                              order.status.step > 0 ? "text-indigo-600" : "",
                              "text-center"
                            )}
                          >
                            <button
                              onClick={() => handleUpdateStatus(1)}
                              className="hover:text-orange-400"
                            >
                              Đang xử lý
                            </button>
                          </div>
                          <div
                            className={classNames(
                              order.status.step > 1 ? "text-indigo-600" : "",
                              "text-center"
                            )}
                          >
                            <button
                              onClick={() => handleUpdateStatus(2)}
                              className="hover:text-orange-400"
                            >
                              Đang vận chuyển
                            </button>
                          </div>

                          <div
                            className={classNames(
                              order.status.step > 2 ? "text-indigo-600" : "",
                              "text-right"
                            )}
                          >
                            <button
                              onClick={() => handleUpdateStatus(4)}
                              className="hover:text-orange-400"
                            >
                              <span
                                className={
                                  order.status.step === 5 ? "line-through" : ""
                                }
                              >
                                Đơn hàng Thành công
                              </span>
                            </button>
                          </div>

                          <div
                            className={classNames(
                              order.status.step === 5 ? "text-red-600" : "",
                              "text-right"
                            )}
                          >
                            <button
                              onClick={() => handleUpdateStatus(5)}
                              className="hover:text-orange-400"
                            >
                              <span
                                className={
                                  order.status.step === 4 ? "line-through" : ""
                                }
                              >
                                Đơn hàng thất bại
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </OrderModal>
  );
}

export default OrderForm;
