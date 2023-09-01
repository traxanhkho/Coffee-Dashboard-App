import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";

function Post({ createdAt }) {
  const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy HH:mm:ss", {
    locale: viLocale,
  });

  return (
    <p className="font-medium text-gray-600 capitalize">Đặt hàng vào: {formattedDate}</p>
  );
}

export default Post;
