import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            background: "red",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1>⚠️ Something went wrong!</h1>
          <p>{this.state.error?.message}</p>
          <p>Check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
