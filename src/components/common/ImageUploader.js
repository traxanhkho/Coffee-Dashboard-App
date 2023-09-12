import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import ImageWrapper from "./ImageWrapper";

const ImageUploader = ({
  register,
  name,
  image,
  setImage,
  setSelectedFile,
}) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    setImage(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="col-span-full">
        <label
          htmlFor="photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Hình ảnh
        </label>
        <div className="mt-2 flex items-center gap-x-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex">
            {!image && (
              <ArrowUpTrayIcon
                className="h-6 w-6 m-auto text-gray-500"
                aria-hidden="true"
              />
            )}
            {image && (
              <ImageWrapper
                src={image}
                className="w-full h-full object-cover"
                alt="Uploaded"
              />
            )}
          </div>
          <label
            htmlFor={name}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <span>Thay đổi</span>
            <input
              {...register(name)}
              id={name}
              name={name}
              onChange={handleImageUpload}
              type="file"
              className="sr-only"
            />
          </label>

          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              setSelectedFile(null);
              setImage(null);
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageUploader;
