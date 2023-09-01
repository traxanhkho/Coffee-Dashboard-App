import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_KEY;

const apiEndpoint = "/toppings";

function toppingUrl(id) {
  return `${apiEndpoint}/${id}`;
}

const toppingSchema = Joi.object({
  name: Joi.string().min(4).required(),
  price: Joi.number().required(),
});



export async function getToppings(options) {
  const page = options?.page || 1;

  try {
    const { data } = await axios.get(`${apiEndpoint}/list?page=${page}`);

    return data;
  } catch (ex) {
    console.error(ex);
  }
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

  const loading = toast.loading("Đang tạo topping mới...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.post(apiEndpoint, formData);

    if (data) {
      toast.update(loading, {
        render: "Tạo topping mới thành công.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }
    reset();
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

export async function saveTopping(topping, selectedFile, setError) {
  const toppingValidate = {
    name: topping.name,
    price: topping.price,
  };

  const validationErrors = validateForm(
    toppingSchema,
    toppingValidate,
    setError
  );

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const formData = new FormData();

  formData.append("image", selectedFile);

  formData.append("name", topping.name);
  formData.append("price", topping.price);

  const loading = toast.loading("Đang cập nhật topping...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.put(toppingUrl(topping._id), formData);

    if (data) {
      toast.update(loading, {
        render: "Đã cập nhật topping thành công.",
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

export async function deleteTopping(toppingId) {
  const loading = toast.loading("Đang xóa topping...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.delete(toppingUrl(toppingId));

    if (data) {
      toast.update(loading, {
        render: "Xóa topping thành công.",
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
    console.log(error);
  }
}
