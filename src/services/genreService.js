import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_KEY;

const apiEndpoint = "/genres";

function genreUrl(genreId) {
  return `${apiEndpoint}/${genreId}`;
}

export async function getGenres() {
  const { data } = await axios.get(apiEndpoint);
  return data;
}

export async function getGenre(genreId) {
  const { data } = await axios.get(genreUrl(genreId));
  return data;
}

export async function createGenre(
  data,
  selectedGenreFile,
  setError,
  handleResetGenreForm
) {
  const newGenre = {
    genre: data.genre,
  };

  const genreSchema = Joi.object({
    genre: Joi.string().required(),
  });

  const validationErrors = await validateForm(genreSchema, newGenre, setError);

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const formData = new FormData();
  if (selectedGenreFile) formData.append("image", selectedGenreFile);

  formData.append("name", newGenre.genre);

  const loading = toast.loading("Đang tạo nhóm mới...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.post(apiEndpoint, formData);

    if (data) {
      toast.update(loading, {
        render: "Tạo nhóm mới thành công.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1200,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }
    handleResetGenreForm();
    return data;
  } catch (error) {
    toast.update(loading, {
      render: "Đã xảy ra lỗi.",
      type: "error",
      isLoading: false,
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 1200,
      className: "custom-toast",
      theme: "dark",
      hideProgressBar: true,
    });
    console.error(error);
  }
}

export async function deleteGenre(genreId) {

  const loading = toast.loading("Đang xóa nhóm...", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.delete(`${apiEndpoint}/${genreId}`);

    if (data) {
      toast.update(loading, {
        render: "Đã xóa nhóm thành công.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1200,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }

    return data;
  } catch (error) {
    if (data) {
      toast.update(loading, {
        render: "Đã xảy ra lỗi.",
        type: "error",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1200,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }
    console.error(error);
  }
}

export async function saveGenre(
  data,
  genreId,
  selectedGenreFile,
  setError,
  handleResetGenreForm
) {
  const genreUpdated = {
    genre: data.genre,
  };

  const genreSchema = Joi.object({
    genre: Joi.string().required(),
  });

  const validationErrors = await validateForm(
    genreSchema,
    genreUpdated,
    setError
  );

  if (Object.keys(validationErrors).length > 0)
    return console.error(validationErrors);

  const formData = new FormData();
  if (selectedGenreFile) formData.append("image", selectedGenreFile);

  formData.append("name", genreUpdated.genre);

  const loading = toast.loading("Đang cập nhật thông tin.", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  try {
    const { data } = await axios.put(`${apiEndpoint}/${genreId}`, formData);

    if (data) {
      toast.update(loading, {
        render: "Cập nhật thành công.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1200,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }

    handleResetGenreForm();
    return data;
  } catch (error) {
    toast.update(loading, {
      render: "Đã xảy ra lỗi.",
      type: "error",
      isLoading: false,
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 1200,
      className: "custom-toast",
      theme: "dark",
      hideProgressBar: true,
    });
    console.error(error);
  }
}
