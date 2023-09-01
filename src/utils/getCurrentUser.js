import axios from "axios";

export async function getCurrentUser(jwt) {
  const { data: currentUser } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_KEY}/users/me`,
    {
      headers: {
        "x-auth-token": jwt,
      },
    }
  );

  return currentUser;
}
