import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL;

const apiEndpoint = "/orders";

function orderUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getOrders() {
  const { data } = await axios.get(apiEndpoint);
  return data;
}

export async function getOrder(productId) {
  const { data } = await axios.get(orderUrl(productId));
  return data;
}

export async function updateOrderStatus(status , orderId) {
  const orderStatus = { status }
  const orderStatusSchema = Joi.string().valid(
    "pending",
    "processing",
    "completed",
    "cancelled"
  );

  const { error } = orderStatusSchema.validate(orderStatus.status);
  if (error) return console.error(error.details[0].message);

  try {
    const { data } = await axios.put(
      `${apiEndpoint}/updateOrderStatus/${orderId}`,
      orderStatus
    );

    toast.success(
      `Đã Cập nhật Trạng thái đơn ${data._id}!`,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        className: "custom-toast",
      }
    );

    return data;
  } catch (error) {
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
  try {
    const { data } = await axios.delete(`${apiEndpoint}/${orderId}`);

    toast.error(`Đã xóa đơn hàng ${data._id}!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });

    return data;
    // Perform any additional operations or update state as needed
  } catch (error) {
    console.error("Error removing product:", error);
    // Handle the error or show a user-friendly message
  }
}
