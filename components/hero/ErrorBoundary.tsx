"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("3D render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>{this.props.fallback ?? <div style={{ color: "white" }}>Error rendering model</div>}</>
      );
    }

    return <>{this.props.children}</>;
  }
}

