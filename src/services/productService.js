import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL;

const apiEndpoint = "/products";

function productUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getProducts() {
  const { data } = await axios.get(apiEndpoint);
  return data;
}

export async function getProduct(productId) {
  const { data } = await axios.get(productUrl(productId));
  return data;
}

export async function createProduct(
  product,
  selectedFile,
  selectedToppings,
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
        price: product.priceSizeS,
      },
      {
        name: "vừa",
        price: product.priceSizeM,
      },
      {
        name: "lớn",
        price: product.priceSizeXL,
      },
    ],
    toppings: [...selectedToppings],
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

  try {
    const { data } = await axios.post(apiEndpoint, formData);

    toast.success(`Đã thêm sản phẩm #${data._id}!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      className: "custom-toast",
    });
    reset();
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
  }
}

export async function saveProduct(
  product,
  productId,
  selectedFile,
  selectedToppings,
  setError,
  router
) {
  const productUpdated = {
    name: product.name,
    genre: product.genre,
    description: product.description,
    numberInStock: product.numberInStock,
    price: product.price,
    sizes: [
      {
        name: "L",
        price: product.priceSizeL,
      },
      {
        name: "M",
        price: product.priceSizeM,
      },
      {
        name: "XL",
        price: product.priceSizeL,
      },
    ],
    toppings: [...selectedToppings],
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

  try {
    const { data } = await axios.put(`${apiEndpoint}/${productId}`, formData);
    router.push(apiEndpoint);

    toast.success(`Sản phẩm #${data.name} đã cập nhật!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      className: "custom-toast",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduct(productId) {
  try {
    const { data } = await axios.delete(`${apiEndpoint}/${productId}`);

    toast.success(`Đã xóa sản phẩm ${data.name}!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      className: "custom-toast",
    });

    return data;
    // Perform any additional operations or update state as needed
  } catch (error) {
    console.error("Error removing product:", error);
    // Handle the error or show a user-friendly message
  }
}
