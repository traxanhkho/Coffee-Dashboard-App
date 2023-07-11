import React, { useEffect } from "react";
import Modal from "./common/Modal";
import Input from "./common/Input";
import Btn from "./common/Btn";
import RenderCity from "./RenderCity";

function CustomerForm({
  open,
  setOpen,
  resetForm,
  onSubmit,
  register,
  errors,
  watch,
  idUpdate,
}) {
  const handleResetForm = () => {
    resetForm();
  };

  useEffect(() => {
    if (!open) handleResetForm();
  }, [open]);

  return (
    <Modal
      open={open}
      title="Nhập thông tin khách hàng"
      setOpen={setOpen}
      buttonSave={false}
    >
      <form className="mt-4 flex-column space-y-4" onSubmit={onSubmit}>
        <Input
          register={register}
          name="name"
          errors={errors}
          label="Tên Khách hàng"
          placeholder={"Nhập tên khách hàng"}
        />
        <RenderCity register={register} watch={watch} errors={errors} />
        <Input
          register={register}
          name="street"
          label="Số nhà tên đường"
          errors={errors}
          placeholder={"Nhập tên đường và số nhà"}
        />
        <Input
          register={register}
          name="numberPhone"
          label="Số điện thoại"
          errors={errors}
          placeholder={"Nhập số điện thoại liên lạc"}
          type="number"
        />
        <Btn size="sm" type="submit" className="w-full justify-center">
          {idUpdate ? "Lưu khách hàng" : "Thêm khách hàng"}
        </Btn>
      </form>
    </Modal>
  );
}

export default CustomerForm;
