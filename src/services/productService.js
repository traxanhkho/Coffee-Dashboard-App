import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import _ from "lodash";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_KEY;

const apiEndpoint = "/products";

function productUrl(id) {
  return `${apiEndpoint}/${id}`;
}

// const page = parseInt(req.query.page) - 1 || 0;
// const limit = parseInt(req.query.limit) || 5;
// const search = req.query.search || "";
// let sort = req.query.sort || "name";createAt , name , price
// let genre = req.query.genre || "all";

export async function getProducts(options) {
  const page = options?.page || 1;
  const sort = options?.sort || "price";
  const genre = options?.genre?.join(",") || "all";

  try {
    const { data } = await axios.get(
      `${apiEndpoint}/list?page=${page}&sort=${sort}&genre=${genre}`
    );

    return data;
  } catch (ex) {
    console.error(ex);
  }
}

export async function getProduct(productId) {
  const { data } = await axios.get(productUrl(productId));
  return data;
}

export async function createProduct(
  product,
  selectedFile,
  checkedToppingIds,
  setError,
  reset
) {
  const newProduct = {
    name: product.name,
    genre: product.genre,
    description: product.description,
    numberInStock: product.numberInStock,
    price: product.price,
    sizes: [
      {
        name: "nhỏ",
        price: product.priceSizeM,
      },
      {
        name: "vừa",
        price: product.priceSizeL,
      },
      {
        name: "lớn",
        price: product.priceSizeXL,
      },
    ],
    toppings: [...checkedToppingIds],
  };

  const productSchema = Joi.object({
    name: Joi.string().min(8).max(255).required(),
    genre: Joi.string().required(),
    description: Joi.string().required(),
    toppings: Joi.array(),
    sizes: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number(),
        })
      )
      .required(),
    price: Joi.number().required(),
    numberInStock: Joi.number().required(),
  });

  const validationErrors = await validateForm(
    productSchema,
    newProduct,
    setError
  );

  if (Object.keys(validationErrors).length > 0) {
    window.scrollTo(0, 0);
    return console.error(validationErrors);
  }

  const formData = new FormData();

  formData.append("image", selectedFile);

  // Iterate over form data object and append properties dynamically
  Object.entries(newProduct).forEach(([key, value]) => {
    if (key !== "image") {
      formData.append(key, JSON.stringify(value));
    }
  });

  const loading = toast.loading("Đang tạo món mới...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.post(apiEndpoint, formData);

    if (data) {
      toast.update(loading, {
        render: "Tạo sản phẩm mới thành công.",
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
    window.scrollTo(0, 0);
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

export async function saveProduct(
  product,
  productId,
  selectedFile,
  checkedToppingIds,
  setError
) {
 
  const productUpdated = {
    name: product.name,
    genre: product.genre,
    description: product.description,
    numberInStock: product.numberInStock,
    price: product.price,
    sizes: [
      {
        name: "vừa",
        price: product.priceSizeL,
      },
      {
        name: "nhỏ",
        price: product.priceSizeM,
      },
      {
        name: "lớn",
        price: product.priceSizeXL,
      },
    ],
    toppings: [...checkedToppingIds],
  };

  const productSchema = Joi.object({
    name: Joi.string().min(8).max(255).required(),
    genre: Joi.string().required(),
    description: Joi.string().required(),
    toppings: Joi.array(),
    sizes: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number(),
        })
      )
      .required(),
    price: Joi.number().required(),
    numberInStock: Joi.number().required(),
  });

  const validationErrors = await validateForm(
    productSchema,
    productUpdated,
    setError
  );

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const formData = new FormData();
  formData.append("image", selectedFile);

  // Iterate over form data object and append properties dynamically
  Object.entries(productUpdated).forEach(([key, value]) => {
    if (key !== "image") {
      formData.append(key, JSON.stringify(value));
    }
  });

  const loading = toast.loading("Đang cập nhật thông tin...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.put(`${apiEndpoint}/${productId}`, formData);

    if (data) {
      toast.update(loading, {
        render: "Đã cập nhật thông tin thành công.",
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

export async function deleteProduct(productId) {
  const loading = toast.loading("Đang xóa sản phẩm...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.delete(`${apiEndpoint}/${productId}`);

    if (data) {
      toast.update(loading, {
        render: "Đã xóa sản phẩm thành công.",
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
