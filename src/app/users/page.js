"use client";
import { useEffect, useState } from "react";
import Layouts from "@/components/Layouts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Table from "@/components/common/Table";
import { toast } from "react-toastify";

function Users() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

  const handleRemoveUserData = () => {
    const loading = toast.loading("Đang xóa dữ liệu...", {
      position: toast.POSITION.TOP_RIGHT,
    });

    setTimeout(() => {
      toast.update(loading, {
        render: "Tài khoản không được cấp phép.",
        type: "warning",
        isLoading: false,
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        className: "custom-toast",
        theme: "dark",
        hideProgressBar: true,
      });
    }, 1200);
  };

  const columns = [
    {
      path: "name",
      label: "Tên nhân sự",
      content: (user) => (
        <div className="flex items-center">
          <div className="">
            <div className="font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      ),
    },
    {
      path: "email",
      label: "Địa chỉ Gmail",
      content: (user) => <p>{user.email}</p>,
    },
    {
      key: "remove",
      content: (user) => (
        <button
          type="button"
          onClick={() => handleRemoveUserData()}
          className="text-red-600 hover:text-red-800 border-none"
        >
          xóa dữ liệu<span className="sr-only">, {user.name}</span>
        </button>
      ),
    },
  ];

  const getUsersWithAuthToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          "x-auth-token": session?.token, // Replace 'token' with your actual token value
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const usersData = await getUsersWithAuthToken();
      setUsers(usersData);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session?.isAdmin) {
    router.push("/restricted");
    return null;
  }

  return (
    <Layouts>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Danh Sách Nhân Sự
            </h1>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="xs:-my-2 xs:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table columns={columns} data={users} />
                {/* <Pagination /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default Users;
