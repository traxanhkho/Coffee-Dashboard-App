"use client";
import { useEffect, useState } from "react";
import Link from "next/link.js";
import Btn from "@/components/common/Btn.js";
import Table from "@/components/common/Table/index.jsx";
import { formatNumberInSeparateThousands } from "../../utils/formatNumberInSeparateThousands";
import { useForm } from "react-hook-form";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  createTopping,
  deleteTopping,
  getToppings,
  saveTopping,
} from "@/services/toppingService";
import ToppingForm from "@/components/ToppingForm";
import Layouts from "@/components/Layouts";
import { useTopping } from "@/context/ToppingContext";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/common/Pagination";

export default function Toppings() {
  const { toppingData, setToppingData } = useTopping();
  const [toppings, setToppings] = useState([]);
  const [openTopping, setOpenTopping] = useState(false);
  const [toppingIdUpdate, setToppingIdUpdate] = useState(null);
  const [toppingImage, setToppingImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const params = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm();

  const handlePaginatePage = async () => {
    const data = await getToppings({ page: params.get("page") });
    setToppingData(data);
  };

  useEffect(() => {
    setToppings(toppingData.toppings);
  }, [toppingData]);

  useEffect(() => {
    handlePaginatePage();
  }, [params]);

  const handleDeleteTopping = async (toppingId) => {
    setToppings(
      toppings.map((topping) =>
        topping._id === toppingId ? { ...topping, removing: true } : topping
      )
    );

    setTimeout(async () => {
      const toppingDeleted = await deleteTopping(toppingId);
      if (toppingDeleted)
        setToppings(
          toppings.filter((topping) => topping._id !== toppingDeleted._id)
        );
    }, 500);
  };

  const handleUpdateTopping = async (formData, toppingId) => {
    const topping = {
      name: formData.name,
      price: formData.price,
      _id: toppingId,
    };

    const toppingUpdated = await saveTopping(topping, selectedFile, setError);

    const listTopping = toppings.map((topping) =>
      topping._id !== toppingUpdated._id ? topping : { ...toppingUpdated }
    );

    setToppings(listTopping);

    setOpenTopping(false);
  };

  const showToppingUpdate = (toppingUpdate) => {
    setOpenTopping(true);
    setToppingIdUpdate(toppingUpdate._id);
    setValue("name", toppingUpdate.name);
    setValue("price", toppingUpdate.price);

    if (toppingUpdate.image) setToppingImage(toppingUpdate.image.url);
  };

  const columns = [
    {
      path: "name",
      label: "Tên",
      content: (topping) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {topping.image && (
              <img
                className="h-10 w-10 rounded-full"
                src={topping.image.url}
                alt={topping.image.name}
              />
            )}
            {!topping.image && (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex">
                <PhotoIcon className="w-6 h-6 m-auto text-gray-500" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{topping.name}</div>
            <div className="text-gray-500 max-w-[240px] truncate">
              {topping.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      path: "price",
      label: "Giá",
      content: (topping) => (
        <p>{`${formatNumberInSeparateThousands(topping.price)} đ`}</p>
      ),
    },
    {
      path: "quantity",
      label: "Số lượng",
      content: () => <p>32</p>,
    },
    {
      key: "edit",
      content: (topping) => (
        <Link
          href={{
            pathname: "toppings",
            query: { toppingId: topping._id },
          }}
          onClick={() => showToppingUpdate(topping)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Chỉnh sửa <span className="sr-only">, {topping.name}</span>
        </Link>
      ),
    },
    {
      key: "remove",
      content: (topping) => (
        <button
          type="button"
          onClick={() => handleDeleteTopping(topping._id)}
          className="text-red-600 hover:text-red-800 border-none"
        >
          Xóa <span className="sr-only">, {topping.name}</span>
        </button>
      ),
    },
  ];

  const handleCreateTopping = async (topping) => {
    const newTopping = await createTopping(
      topping,
      selectedFile,
      setError,
      reset
    );

    setToppings([...toppings, newTopping]);
  };

  const onSubmitFormTopping = (data) => {
    const topping = {
      name: data.name,
      price: data.price,
    };

    if (toppingIdUpdate) {
      handleUpdateTopping(data, toppingIdUpdate);
    } else {
      handleCreateTopping(topping);
    }
  };

  //////

  const totalPages = Math.ceil(toppingData.total / toppingData.limit) || 0;

  const handleNextPage = () => {
    const currentPage = parseInt(toppingData.page) + 1;
    if (currentPage > totalPages) return;

    router.push(`/toppings?page=${currentPage}`);
  };

  const handlePrevPage = () => {
    const currentPage = parseInt(toppingData.page) - 1;
    if (currentPage < 1) return;

    router.push(`/toppings?page=${currentPage}`);
  };

  ///////
  return (
    <Layouts>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Danh Sách Topping
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Btn
              size="sm"
              onClick={() => {
                setOpenTopping(!openTopping);
                setToppingIdUpdate(null);
              }}
            >
              Thêm Topping
            </Btn>

            <ToppingForm
              openTopping={openTopping}
              setOpenTopping={setOpenTopping}
              resetForm={reset}
              onSubmit={handleSubmit(onSubmitFormTopping)}
              register={register}
              errors={errors}
              toppingImage={toppingImage}
              setToppingImage={setToppingImage}
              setSelectedFile={setSelectedFile}
              toppingIdUpdate={toppingIdUpdate}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="xs:-my-2 xs:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table columns={columns} data={toppings} />

                <Pagination
                  data={toppingData}
                  handleNextPage={handleNextPage}
                  handlePrevPage={handlePrevPage}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
