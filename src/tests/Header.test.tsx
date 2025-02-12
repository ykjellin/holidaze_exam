import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../components/layout/Header.tsx";

test("renders site title", () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  const titleElement = screen.getByText(/Holidaze/i);
  expect(titleElement).toBeInTheDocument();
});
