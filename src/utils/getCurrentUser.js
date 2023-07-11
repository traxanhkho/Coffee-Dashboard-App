import axios from "axios";

export async function getCurrentUser(jwt) {
  const { data: currentUser } = await axios.get(
    "http://localhost:5000/api/users/me",
    {
      headers: {
        "x-auth-token": jwt,
      },
    }
  );

  return currentUser;
}
