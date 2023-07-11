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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Handle redirect manually
    });

    if (result?.error) {
      // Handle login error
      console.error(result.error);
      setError('email', { message : 'Invalid Email or Password.'});
    } 
    // else {
    //   // Redirect to home page
    //   router.push("/");
    // }
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

    try {
      const { data: newUser } = await axios.post(
        "http://localhost:5000/api/users",
        _.pick(userData, ["name", "email", "password"])
      );

      if (newUser) {
        router.push("/api/login");

        toast.success(`user ${newUser.name} create success.`, {
          position: "top-right", // Position of the toast container
          autoClose: 3000, // Duration in milliseconds after which the toast will automatically close
          hideProgressBar: false, // Show or hide the progress bar
          closeOnClick: true, // Close the toast when clicked
          pauseOnHover: true, // Pause the autoClose timer when the mouse hovers over the toast
          draggable: true, // Allow the toast to be draggable
        });
      }
    } catch (ex) {
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
