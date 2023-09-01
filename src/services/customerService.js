import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL;

const apiEndpoint = "/customers";

const customerSchema = Joi.object({
  name: Joi.string().required(),
  numberPhone: Joi.string().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  ward: Joi.string().required(),
  street: Joi.string().required(),
});

function customerUrl(customerId) {
  return `${apiEndpoint}/${customerId}`;
}

export async function getCustomers() {
  const { data } = await axios.get(apiEndpoint);
  return data;
}

export async function getCustomer(customerId) {
  const { data } = await axios.get(customerUrl(customerId));
  return data;
}

export async function createCustomer(customer, setError, closeModal) {
  const validationErrors = await validateForm(
    customerSchema,
    customer,
    setError
  );

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const newCustomer = {
    name: customer.name,
    numberPhone: customer.numberPhone,
    address: {
      city: customer.city,
      district: customer.district,
      ward: customer.ward,
      street: customer.street,
    },
  };

  try {
    const { data } = await axios.post(apiEndpoint, newCustomer);
    closeModal();
    toast.success(`Đã tạo khách hàng #${data.name}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function saveCustomer(customer, customerId, setError) {
  const validationErrors = await validateForm(
    customerSchema,
    customer,
    setError
  );

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const customerUpdated = {
    name: customer.name,
    numberPhone: customer.numberPhone,
    address: {
      city: customer.city,
      district: customer.district,
      ward: customer.ward,
      street: customer.street,
    },
  };

  try {
    const { data } = await axios.put(customerUrl(customerId), customerUpdated);

    toast.success(`Đã cập nhật thông tin #${data.name}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCustomer(customerId) {
  const { data } = await axios.delete(customerUrl(customerId));

  toast.warning(`Đã xóa khách hàng #${data.name}`, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "custom-toast",
  });

  return data;
}
