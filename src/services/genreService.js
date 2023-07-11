import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL;

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

  try {
    const { data } = await axios.post(apiEndpoint, formData);

    toast.success(`Đã thêm nhóm #${data.name}!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      className: "custom-toast",
    });
    handleResetGenreForm();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteGenre(genreId) {
  try {
    const { data } = await axios.delete(`${apiEndpoint}/${genreId}`);

    toast.success(`Đã xóa nhóm ${data.name}!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      className: "custom-style",
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function saveGenre(
  data,
  genreId , 
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

  try {
    const { data } = await axios.put(`${apiEndpoint}/${genreId}`, formData);

    toast.success(`Đã cập nhật nhóm #${data.name}!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      className: "custom-toast",
    });
    handleResetGenreForm();
    return data;
  } catch (error) {
    console.error(error);
  }
}
