import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL;

const apiEndpoint = "/orders";

function orderUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getOrders(options) {
  const page = options?.page || 1;

  try {
    const { data } = await axios.get(`${apiEndpoint}?page=${page}`);

    return data;
  } catch (ex) {
    console.error(ex);
  }
}

export async function getOrder(productId) {
  try {
    const { data } = await axios.get(orderUrl(productId));
    return data;
  } catch (ex) {
    console.error(ex);
  }
}

export async function updateOrderStatus(orderId, step) {
  const statusList = [
    { name: "ordered", label: "Đã đặt hàng", step: 0 },
    { name: "pending", label: "Đang xử lý", step: 1 },
    { name: "processing", label: "Đang vận chuyển", step: 2 },
    { name: "completed", label: "Đã giao hàng", step: 4 },
    { name: "cancelled", label: "Giao hàng thất bại", step: 5 },
  ];

  const status = statusList.find((status) => status.step === step);
  if (!status) return console.error("Đã xảy ra lỗi");

  const loading = toast.loading("Đang cập nhật trạng thái...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.put(
      `${apiEndpoint}/updateOrderStatus/${orderId}`,
      { status: status }
    );

    if (data) {
      toast.update(loading, {
        render: "Đã cập nhật trạng thái.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }
    return data;
  } catch (error) {
    toast.update(loading, {
      render: "Đã xảy ra lỗi.",
      type: "error",
      isLoading: false,
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
      className: "custom-toast",
      theme: "dark",
      hideProgressBar: true,
    });
    console.error(error);
  }
}

export async function getTotalAmount(orderId) {
  try {
    const { data } = await axios.get(
      `${apiEndpoint}/calculateTotalPrice/${orderId}`
    );
    return data.totalPrice;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteOrder(orderId) {
  const loading = toast.loading("Đang xóa đơn hàng...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.delete(`${apiEndpoint}/${orderId}`);

    if (data) {
      toast.update(loading, {
        render: "Đã xóa đơn hàng.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }

    return data;
    // Perform any additional operations or update state as needed
  } catch (error) {
    toast.update(loading, {
      render: "Đã xảy ra lỗi.",
      type: "error",
      isLoading: false,
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
      className: "custom-toast",
      theme: "dark",
      hideProgressBar: true,
    });
    console.error("Error removing product:", error);
    // Handle the error or show a user-friendly message
  }
}
