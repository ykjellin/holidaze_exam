import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
