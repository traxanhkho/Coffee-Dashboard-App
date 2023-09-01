import Link from "next/link";

function Restricted(props) {
  return (
    <div>
      <h2>Access denied!</h2>
      <p>Sorry,you can&rsquo;t access this page, because you are not an admin.</p>
      <Link className="text-blue-900 underline  decoration-solid" href={"/"}>
        Go to back, Home page.
      </Link>
    </div>
  );
}

export default Restricted;
