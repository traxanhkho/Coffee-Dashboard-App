'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const LoadingProgress = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#FCB42D"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <ToastContainer />
    </>
  );
};

export default LoadingProgress;