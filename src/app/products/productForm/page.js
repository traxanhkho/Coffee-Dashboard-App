"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import _ from "lodash";
import Btn from "@/components/common/Btn";
import Checkbox from "@/components/common/Checkbox";
import Container from "@/components/common/Container";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import SelectMenu from "@/components/common/SelectMenu";
import Textarea from "@/components/common/Textarea";
import ImageProductUploader from "@/components/common/ImageProductUploader";
import { useRouter } from "next/navigation";
import {
  createProduct,
  getProduct,
  saveProduct,
} from "@/services/productService";
import { getGenres } from "@/services/genreService";
import { getToppings } from "@/services/toppingService";
import Layouts from "@/components/Layouts";

export default function productForm() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [genres, setGenres] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [image, setImage] = useState(null);
  const productIdQuery = useSearchParams().get("productId");

  const methods = useForm({
    defaultValues: {
      toppings: [],
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const setValueForm = (productSelected) => {
    setValue("name", productSelected.name);
    setValue("description", productSelected.description);
    setValue("genre", productSelected.genre);
    setValue("price", productSelected.price);
    setValue("numberInStock", productSelected.numberInStock);
    if (productSelected.image) setImage(productSelected.image.url);
    // set value price size

    productSelected.sizes.forEach((size) => {
      switch (size.name) {
        case "nhỏ":
          setValue("priceSizeM", size.price);
          break;
        case "vừa":
          setValue("priceSizeL", size.price);
          break;
        case "lớn":
          setValue("priceSizeXL", size.price);
          break;
      }
    });

    let toppingsToUpdate = _.cloneDeep(toppings);

    productSelected.toppings.forEach((item) => {
      const indexToUpdate = _.findIndex(toppingsToUpdate, { _id: item._id });
      if (indexToUpdate !== -1) {
        toppingsToUpdate[indexToUpdate].isChecked = true;
      }
    });

    setToppings(toppingsToUpdate);
  };

  const getDataFromServer = async () => {
    try {
      setGenres(await getGenres());
      const data = await getToppings();
      if (productIdQuery) {
        const currentProduct = await getProduct(productIdQuery);
        setCurrentProduct(currentProduct);
      }
      setToppings(data?.allToppings);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  useEffect(() => {
    if (currentProduct) setValueForm(currentProduct);
  }, [currentProduct]);

  const onSubmit = (data) => {
    let checkedToppingIds = _.chain(toppings)
      .filter({ isChecked: true })
      .map("_id")
      .value();

    if (productIdQuery) {
      saveProduct(
        data,
        productIdQuery,
        selectedFile,
        checkedToppingIds,
        setError,
        router
      );
    } else {
      createProduct(data, selectedFile, checkedToppingIds, setError, reset);
    }
  };

  // http://localhost:5000/api/products
  // https://coffee-server-test.onrender.com/api/products

  return (
    <Layouts>
      <Container>
        <div className="py-4 lg:py-8 md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Thông tin sản phẩm
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Mục tiêu chính của trang thông tin sản phẩm là cung cấp đầy đủ
                thông tin về sản phẩm để khách hàng có thể đưa ra quyết định mua
                hàng thông minh và hài lòng với sự lựa chọn của mình.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <FormProvider {...methods}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <Input
                      register={register}
                      name="name"
                      errors={errors}
                      label="Tên sản phẩm"
                      placeholder={"Nhập tên sản phẩm"}
                    />
                    <Textarea
                      register={register}
                      label="Mô tả sản phẩm"
                      name="description"
                      errors={errors}
                      rows={3}
                      placeholder="Nhập mô tả sản phẩm"
                      defaultValue=""
                    />
                    <SelectMenu
                      register={register}
                      label="Loại sản phẩm"
                      name="genre"
                      items={genres}
                    />
                    <Input
                      register={register}
                      name="price"
                      type="number"
                      isPriceField={true}
                      min={0}
                      defaultValue={0}
                      errors={errors}
                      label="Giá gốc sản phẩm"
                      placeholder={"Nhập giá gốc của sản phẩm"}
                    />
                    <Input
                      register={register}
                      name="numberInStock"
                      type="number"
                      min={0}
                      defaultValue={0}
                      errors={errors}
                      label="Số lượng sản phẩm"
                      placeholder={"Nhập số lượng sản phẩm"}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        register={register}
                        name="priceSizeM"
                        type="number"
                        isPriceField={true}
                        min={0}
                        defaultValue={0}
                        errors={errors}
                        label="Giá size nhỏ"
                        placeholder={"Nhập giá size nhỏ"}
                      />
                      <Input
                        register={register}
                        name="priceSizeL"
                        type="number"
                        isPriceField={true}
                        min={0}
                        defaultValue={0}
                        errors={errors}
                        label="Giá size vừa"
                        placeholder={"Nhập giá size vừa"}
                      />
                      <Input
                        register={register}
                        name="priceSizeXL"
                        type="number"
                        isPriceField={true}
                        min={0}
                        defaultValue={0}
                        errors={errors}
                        label="Giá size lớn"
                        placeholder={"Nhập giá size lớn"}
                      />
                    </div>

                    <Btn size="md" onClick={() => setOpenModal(!openModal)}>
                      Thêm Toppings
                    </Btn>
                    <Modal
                      open={openModal}
                      title="Vui lòng chọn toppings"
                      setOpen={setOpenModal}
                    >
                      <Checkbox
                        toppings={toppings}
                        setToppings={setToppings}
                        currentProduct={currentProduct}
                      />
                      {/* <FieldArray /> */}
                    </Modal>
                    <ImageProductUploader
                      register={register}
                      setSelectedFile={setSelectedFile}
                      image={image}
                      setImage={setImage}
                    />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Lưu sản phẩm
                    </button>
                  </div>
                </div>
              </FormProvider>
            </form>
          </div>
        </div>
      </Container>
    </Layouts>
  );
}
