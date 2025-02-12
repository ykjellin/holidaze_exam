import { render, screen } from "@testing-library/react";
import { Footer } from "../components/layout/Footer";

test("renders footer text", () => {
  render(<Footer />);
  const footerText = screen.getByText(/© 2025 Holidaze/i);
  expect(footerText).toBeInTheDocument();
});
