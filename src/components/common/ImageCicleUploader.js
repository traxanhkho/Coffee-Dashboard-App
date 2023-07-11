import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";

function ImageCicleUploader({ register , name , image , setImage , setSelectedFile }) {
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)

    setImage(URL.createObjectURL(file));
  };

  return (
    <>
      <label htmlFor={name} className="h-10 w-10 rounded-full hover:cursor-pointer overflow-hidden bg-gray-200 flex">
        {!image && (
          <ArrowUpTrayIcon
            className="h-6 w-6 m-auto text-gray-500"
            aria-hidden="true"
          />
        )}
        {image && (
          <img
            src={image}
            className="w-full h-full object-cover"
            alt="Uploaded"
          />
        )}
        <input
          {...register(name)}
          id={name}
          name={name}
          onChange={handleImageUpload}
          type="file"
          className="sr-only"
        />
      </label>
    </>
  );
}

export default ImageCicleUploader;
