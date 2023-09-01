import React, { useEffect } from "react";
import Modal from "./common/Modal";
import Input from "./common/Input";
import Btn from "./common/Btn";
import ImageUploader from "./common/ImageUploader";

function ToppingForm({
  openTopping,
  setOpenTopping,
  resetForm,
  onSubmit,
  register,
  errors,
  toppingImage,
  setToppingImage,
  setSelectedFile,
  toppingIdUpdate,
}) {
    
  const handleResetForm = () => {
    resetForm();
    setToppingImage(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (!openTopping) handleResetForm();
  }, [openTopping]);

  return (
    <Modal
      open={openTopping}
      title="Nhập thông tin Topping"
      setOpen={setOpenTopping}
      buttonSave={false}
    >
      <div className="max-w-2xl">

      
      <form className="mt-4 flex-column space-y-4" onSubmit={onSubmit}>
        <Input
          register={register}
          name="name"
          errors={errors}
          label="Tên sản phẩm"
          placeholder={"Nhập tên sản phẩm"}
        />
        <Input
          register={register}
          name="price"
          label="Giá Topping"
          errors={errors}
          placeholder={"Nhập giá Topping"}
          type="number"
          isPriceField={true}
          defaultValue={0}
          min={0}
        />
        <ImageUploader
          register={register}
          image={toppingImage}
          setImage={setToppingImage}
          setSelectedFile={setSelectedFile}
          name={"topping-uploader"}
        />
        <Btn size="sm" type="submit" className="w-full justify-center">
          {toppingIdUpdate ? "Lưu Topping" : "Thêm Topping"}
        </Btn>
      </form></div>
    </Modal>
  );
}

export default ToppingForm;
