import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Alba Forum crashed', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="crash">
        <h1>Alba Forum hit an error</h1>
        <pre>{this.state.error.message}</pre>
        <button type="button" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}
