import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL;

const apiEndpoint = "/toppings";

function toppingUrl(id) {
  return `${apiEndpoint}/${id}`;
}

const toppingSchema = Joi.object({
  name: Joi.string().min(4).required(),
  price: Joi.number().required(),
});

export async function getToppings() {
  const { data } = await axios.get(apiEndpoint);
  return data;
}

export async function getTopping(toppingId) {
  const { data } = await axios.get(toppingUrl(toppingId));
  return data;
}

export async function createTopping(topping, selectedFile, setError, reset) {
  const validationErrors = await validateForm(toppingSchema, topping, setError);

  if (Object.keys(validationErrors).length > 0) {
    return console.error(validationErrors);
  }

  const formData = new FormData();

  formData.append("image", selectedFile);

  formData.append("name", topping.name);
  formData.append("price", topping.price);

  try {
    const { data } = await axios.post(apiEndpoint, formData);

    toast.success(`Đã thêm topping #${data.name}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });

    reset();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function saveTopping(topping ,  selectedFile, setError) {

  const toppingValidate = { 
    name : topping.name , 
    price : topping.price 
  }

  const validationErrors = validateForm(toppingSchema, toppingValidate, setError);

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const formData = new FormData();

  formData.append("image", selectedFile);

  formData.append("name", topping.name);
  formData.append("price", topping.price);

  try {
    const { data } = await axios.put(toppingUrl(topping._id), formData);

    toast.success(`Đã cập nhật topping #${data.name}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });

    return data ; 
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTopping(toppingId) {
  try {
    const { data } = await axios.delete(toppingUrl(toppingId));

    toast.warning(`Đã xóa topping #${data.name}`, {
      POSITION: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}
