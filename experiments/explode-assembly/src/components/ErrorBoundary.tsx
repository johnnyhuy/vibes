import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          color: '#fff',
          padding: '40px',
          fontFamily: 'monospace',
          fontSize: '14px',
          overflow: 'auto',
          zIndex: 9999,
        }}>
          <h1 style={{ color: '#ff4444', fontSize: '24px', marginBottom: '20px' }}>
            ⚠️ Explode Assembly Error
          </h1>
          <div style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #333',
            marginBottom: '20px',
          }}>
            <div style={{ color: '#ff6666', marginBottom: '10px', fontWeight: 'bold' }}>
              {this.state.error?.name}: {this.state.error?.message}
            </div>
            <pre style={{ 
              fontSize: '12px', 
              overflow: 'auto',
              color: '#aaa',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {this.state.error?.stack}
            </pre>
          </div>
          {this.state.errorInfo && (
            <div style={{ 
              background: '#1a1a1a', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #333',
            }}>
              <div style={{ color: '#88ccff', marginBottom: '10px', fontWeight: 'bold' }}>
                Component Stack:
              </div>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto',
                color: '#aaa',
                whiteSpace: 'pre-wrap',
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
