"use client";
import Layouts from "@/components/Layouts";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { useLayout } from "@/context/LayoutContext";
import { validateForm } from "@/utils/validateForm";
import axios from "axios";
import Joi from "joi";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Profile() {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);
  const { profile, imageDemo } = useLayout();

  function createObjectURL(object) {
    return window.URL
      ? window.URL.createObjectURL(object)
      : window.webkitURL.createObjectURL(object);
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    setImage(createObjectURL(file));
  };

  function setValueDefaultForm(data) {
    if (!data) return;
    setValue("name", data.userId.name);
    setValue("aboutMe", data.aboutMe);
    setValue("address", data.address);
    setValue("numberPhone", data.numberPhone);
    setValue("position", data.position);
    setImage(data.image?.url);
  }

  useEffect(() => {
    setValueDefaultForm(profile);
  }, [profile]);

  const handleUpdateProfile = async (data) => {
    if (!profile) return;

    const formData = new FormData();

    formData.append("image", selectedFile);

    // Iterate over form data object and append properties dynamically
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image") {
        formData.append(key, JSON.stringify(value));
      }
    });

    const loading = toast.loading("Đang cập nhật thông tin...", {
      position: toast.POSITION.BOTTOM_LEFT,
    });

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_KEY}/profiles/${profile.userId._id}`,
        formData
      );

      if (data) {
        toast.update(loading, {
          render: "Đã cập nhật thành công.",
          type: "success",
          isLoading: false,
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 1200,
          className: "custom-toast",
          theme: "dark",
          hideProgressBar: true,
        });
      }
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
  };

  const onSubmit = async (data) => {
    const profileSchema = Joi.object({
      name: Joi.string().min(4).max(255).required(),
      aboutMe: Joi.string().required(),
      position: Joi.string().required(),
      address: Joi.string().required(),
      numberPhone: Joi.number().required(),
    });

    const profileUpdated = _.pick(data, [
      "name",
      "aboutMe",
      "numberPhone",
      "position",
      "address",
    ]);

    const validationErrors = await validateForm(
      profileSchema,
      profileUpdated,
      setError
    );

    if (Object.keys(validationErrors).length > 0)
      return console.error(validationErrors);

    handleUpdateProfile(data);
  };

  return (
    <Layouts>
      <div>
        <main className="relative mt-4 md:mt-10">
          <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8">
            <div className="overflow-hidden rounded-lg bg-white">
              <div className=" lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                <div className="hidden lg:block lg:col-span-4">
                  <h2 className="text-lg font-medium leading-6 text-gray-900">
                    Thông tin cá nhân
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Thông tin này sẽ được hiển thị công khai nên hãy cẩn thận
                    khi chia sẻ.
                  </p>
                </div>
                <form
                  className="divide-y divide-gray-200 lg:col-span-8"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Profile section */}
                  <div className="py-6 px-4 sm:p-6 lg:pb-8">
                    <div className="lg:hidden">
                      <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Thông tin cá nhân
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Thông tin này sẽ được hiển thị công khai nên hãy cẩn
                        thận khi chia sẻ.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col lg:flex-row">
                      <div className="flex-grow space-y-6">
                        <div>
                          <Input
                            register={register}
                            name="name"
                            errors={errors}
                            label="Tên người dùng"
                          />
                        </div>

                        <div>
                          <Textarea
                            register={register}
                            label="Giới thiệu bản thân"
                            name="aboutMe"
                            errors={errors}
                            rows={3}
                            defaultValue=""
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Mô tả ngắn gọn cho hồ sơ của bạn.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                        <p
                          className="text-sm font-medium text-gray-700"
                          aria-hidden="true"
                        >
                          Ảnh đại diện
                        </p>
                        <div className="mt-1 lg:hidden">
                          <div className="flex items-center">
                            <div
                              className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                              aria-hidden="true"
                            >
                              <img
                                className="h-full w-full rounded-full"
                                src={image || imageDemo}
                                alt=""
                              />
                            </div>
                            <div className="ml-5 rounded-md shadow-sm">
                              <div className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50">
                                <label
                                  htmlFor="mobile-user-photo"
                                  className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                                >
                                  <span>Thay đổi</span>
                                  <span className="sr-only"> ảnh đại diện</span>
                                </label>
                                <input
                                  {...register("user-photo")}
                                  id="user-photo"
                                  onChange={handleImageUpload}
                                  name="user-photo"
                                  type="file"
                                  className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="relative hidden overflow-hidden rounded-full lg:block">
                          <img
                            className="relative h-40 w-40 rounded-full"
                            src={image || imageDemo}
                            alt="avatar"
                          />
                          <label
                            htmlFor="user-photo"
                            className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                          >
                            <span>Thay đổi</span>
                            <span className="sr-only"> ảnh đại diện</span>
                            <div className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-12 gap-6">
                      <div className="col-span-12 sm:col-span-6">
                        <Input
                          register={register}
                          name="numberPhone"
                          type="number"
                          errors={errors}
                          label="Số điện thoại"
                        />
                      </div>

                      <div className="col-span-12 sm:col-span-6">
                        <Input
                          register={register}
                          name="position"
                          errors={errors}
                          label="Vị trí đảm nhiệm"
                        />
                      </div>

                      <div className="col-span-12">
                        <Input
                          register={register}
                          name="address"
                          errors={errors}
                          label="Địa chỉ cụ thể"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-2 py-1 rounded-md text-white hover:opacity-80 bg-blue-500 block ml-auto mr-4 sm:mr-6"
                  >
                    Cập nhật
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layouts>
  );
}
