import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404 - Page Not Found</h1>
      <p className="lead">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
