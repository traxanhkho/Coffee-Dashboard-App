import React from "react";
import Image from "next/image";

function ImageWrapper({
  className,
  src = "",
  alt = "picture image alt default.",
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} fill alt={alt} />
      ) : (
        <div className="w-full h-full bg-gray-200"></div>
      )}
    </div>
  );
}

export default ImageWrapper;
