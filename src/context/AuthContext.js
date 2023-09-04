"use client";
import _ from "lodash";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // State to hold the authenticated user
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(_.pick(session, ["_id", "name", "email", "isAdmin"]));
  }, [session]);

  // Function to set the authenticated user
  const login = async (userData, setError) => {
    const { email, password } = userData;

    const loading = toast.loading("Đang thực hiện đăng nhập...", {
      position: toast.POSITION.TOP_CENTER,
    });

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Handle redirect manually
      });

      if (result?.error) {
        // Handle login error
        toast.update(loading, {
          render: "Đăng nhập thất bại.",
          type: "error",
          isLoading: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          className: "custom-toast",
          theme: "dark",
          hideProgressBar: true,
        });
        console.error(result.error);
        return setError("email", { message: "Invalid Email or Password." });
      }

      toast.update(loading, {
        render: "Chào mừng bạn comeback.",
        type: "success",
        isLoading: false,
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        className: "custom-toast",
        theme: "light",
        hideProgressBar: true,
      });
    } catch (ex) {
      console.error(ex);
    }
  };

  const signUp = async (userData, setError) => {
    //validate user
    const validateUser = function (user) {
      return user.confirmPassword == user.password
        ? null
        : "The password does not match.";
    };
    const error = validateUser(userData);
    if (error) return setError("confirmPassword", { message: error });

    const loading = toast.loading("Đang đăng ký người dùng mới...", {
      position: toast.POSITION.TOP_CENTER,
    });

    try {
      const { data: newUser } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_KEY}/users`,
        _.pick(userData, ["name", "email", "password"])
      );

      if (newUser) {
        router.push("/api/login");

        toast.update(loading, {
          render: "Đăng ký thành công.",
          type: "success",
          isLoading: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          className: "custom-toast",
          theme: "light",
          hideProgressBar: true,
        });
      }
    } catch (ex) {
      toast.update(loading, {
        render: "Đã xãy ra lỗi.",
        type: "error",
        isLoading: false,
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
      
      if (ex.response && ex.response.status === 400) {
        const errorMessage = ex.response.data;
        setError("email", {
          message: errorMessage,
        });
      }
    }
  };

  const authContextValue = {
    currentUser,
    login,
    signUp,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
