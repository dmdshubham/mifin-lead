import { ErrorBoundaryProps, ErrorBoundaryState } from "@mifin/Interface/components";
import { Component, ErrorInfo} from "react";

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
    };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: "#004A89",
            fontWeight: 600,
          }}
        >
          Something went wrong
        </div>
      );
    }
    return this.props.children;
  }
}
