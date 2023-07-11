"use client";
import { useState, useEffect } from "react";
import Link from "next/link.js";
import FilterProducts from "@/components/FilterProducts.js";
import Btn from "@/components/common/Btn.js";
import Table from "@/components/common/Table/index.jsx";
import Input from "@/components/common/Input.js";
import ImageCicleUploader from "@/components/common/ImageCicleUploader.js";
import { formatNumberInSeparateThousands } from "../../utils/formatNumberInSeparateThousands";
import { useForm } from "react-hook-form";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { deleteProduct, getProducts } from "@/services/productService";
import {
  createGenre,
  deleteGenre,
  getGenres,
  saveGenre,
} from "@/services/genreService";
import Layouts from "@/components/Layouts";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [genreImage, setGenreImage] = useState(null);
  const [genreIdUpdate, setGenreIdUpdate] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenreFile, setSelectedGenreFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  const getListProduct = async () => {
    const products = await getProducts();
    setProducts(products);
  };

  const getListGenre = async () => {
    const genres = await getGenres();
    setGenres(genres);
  };

  useEffect(() => {
    getListProduct();
    getListGenre();
  }, []);

  const handleResetGenreForm = () => {
    reset();
    setGenreImage(null);
    setSelectedGenreFile(null);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(
      products.map((item) =>
        item._id === productId ? { ...item, removing: true } : item
      )
    );
    setTimeout(async () => {
      const productDeleted = await deleteProduct(productId);
      if (productDeleted)
        setProducts(
          products.filter((product) => product._id !== productDeleted._id)
        );
    }, 500);
  };

  const columns = [
    {
      path: "name",
      label: "Tên",
      content: (product) => (
        <Link href={`/products/${product._id}`} className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {product.image && (
              <img
                className="h-10 w-10 rounded-full"
                src={product.image.url}
                alt={product.image.name}
              />
            )}
            {!product.image && (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex">
                <PhotoIcon className="w-6 h-6 m-auto text-gray-500" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-gray-500 max-w-[240px] truncate">
              {product.description}
            </div>
          </div>
        </Link>
      ),
    },
    {
      path: "genre",
      label: "Phân loại",
      content: (product) => (
        <div className="text-gray-900">{product.genre}</div>
      ),
    },
    {
      path: "numberInStock",
      label: "Số lượng",
      content: ({ numberInStock }) => {
        let statusClasses = "bg-green-100 text-green-800";
        if (numberInStock == 0) statusClasses = "bg-red-100 text-red-800";
        else if (numberInStock > 0 && numberInStock < 10)
          statusClasses = "bg-yellow-100 text-yellow-800";

        return (
          <span
            className={`inline-flex rounded-full ${statusClasses} px-2 text-xs font-semibold leading-5`}
          >
            {numberInStock}
          </span>
        );
      },
    },
    {
      path: "price",
      label: "Giá",
      content: (product) => (
        <p>{`${formatNumberInSeparateThousands(product.price)} đ`}</p>
      ),
    },
    {
      key: "edit",
      content: (product) => (
        <Link
          href={{
            pathname: "products/productForm",
            query: { productId: product._id },
          }}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Chỉnh sửa <span className="sr-only">, {product.name}</span>
        </Link>
      ),
    },
    {
      key: "remove",
      content: (product) => (
        <button
          type="button"
          onClick={() => handleDeleteProduct(product._id)}
          className="text-red-600 hover:text-red-800 border-none"
        >
          Xóa <span className="sr-only">, {product.name}</span>
        </button>
      ),
    },
  ];

  const handleCreateGenre = async (data) => {
    const newGenre = await createGenre(
      data,
      selectedGenreFile,
      setError,
      handleResetGenreForm
    );

    const listGenre = _.cloneDeep(genres);
    listGenre.push(newGenre);
    if (newGenre) setGenres(listGenre);
  };

  const selectorGenreUpdate = (genre) => {
    setGenreIdUpdate(genre._id);
    setValue("genre", genre.name);
    if (genre.image) {
      setGenreImage(genre.image.url);
    } else {
      setGenreImage(null);
    }
  };

  const handleUpdateGenre = async (data, genreId) => {
    try {
      const genreUpdated = await saveGenre(
        data,
        genreId,
        selectedGenreFile,
        setError,
        handleResetGenreForm
      );

      const listGenre = genres.map((genre) =>
        genre._id !== genreIdUpdate ? { ...genre } : { ...genreUpdated }
      );

      setGenreIdUpdate(null);
      if (genreUpdated) {
        setGenres(listGenre);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitFormGenre = (data) => {
    if (genreIdUpdate) {
      handleUpdateGenre(data, genreIdUpdate);
    } else {
      handleCreateGenre(data);
    }
  };

  const handleDeleteGenre = (genreId) => {
    setGenres(
      genres.map((genre) =>
        genre._id !== genreId ? genre : { ...genre, removing: true }
      )
    );

    setTimeout(async () => {
      const genreDeleted = await deleteGenre(genreId);
      if (genreDeleted)
        setGenres(genres.filter((genre) => genre._id !== genreDeleted._id));
      handleResetGenreForm();
    }, 500);
  };

  return (
    <Layouts>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Sản phẩm</h1>
            <form
              className="my-4 flex space-x-4"
              onSubmit={handleSubmit(onSubmitFormGenre)}
            >
              <ImageCicleUploader
                register={register}
                setSelectedFile={setSelectedGenreFile}
                image={genreImage}
                setImage={setGenreImage}
                name="genre-uploader"
              />
              <Input
                register={register}
                name="genre"
                className={"flex-1"}
                errors={errors}
                label="Tên nhóm sản phẩm"
                placeholder={"Nhập tên nhóm sản phẩm"}
              />
              <Btn type="submit" size="md" className={"max-h-[38px]"}>
                {genreIdUpdate ? "Chỉnh sửa" : "Thêm"}
              </Btn>
            </form>

            <div>
              {genres.map((genre) => (
                <div
                  key={genre._id}
                  className={`cursor-pointer transition-opacity duration-500 inline-flex mr-1 mt-1 items-center rounded-full bg-indigo-100 py-0.5 pl-2.5 pr-1 text-sm font-medium text-indigo-700 ${
                    genre.removing ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <button
                    alt="chỉnh sửa"
                    onClick={() => selectorGenreUpdate(genre)}
                  >
                    {genre.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGenre(genre._id)}
                    className="z-999 ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">Remove large option</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href={"/products/productForm"}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 ml-4 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Thêm sản phẩm
            </Link>
          </div>
        </div>
        <FilterProducts />
        <div className="mt-8 flex flex-col">
          <Table columns={columns} data={products} />
        </div>
      </div>
    </Layouts>
  );
}
