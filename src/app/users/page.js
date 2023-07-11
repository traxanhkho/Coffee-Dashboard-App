"use client";
import { useEffect, useState } from "react";
import Layouts from "@/components/Layouts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

function Users() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);

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
      <div>
        <p>user page</p>
        {users.map((user) => (
          <p key={user._id}>{user.name}</p>
        ))}
      </div>
    </Layouts>
  );
}

export default Users;
