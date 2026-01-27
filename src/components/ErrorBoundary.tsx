import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error capturado por ErrorBoundary:', error, 
errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio como Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Recargar la página
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#1f2937',
          color: 'white',
          fontFamily: 'system-ui',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' 
}}>😵</div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Algo salió mal
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              La aplicación encontró un error inesperado. 
              Hemos registrado el problema y trabajaremos en solucionarlo.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details style={{
                background: '#111827',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                textAlign: 'left',
                cursor: 'pointer',
              }}>
                <summary style={{ fontWeight: 'bold', marginBottom: 
'0.5rem' }}>
                  Detalles del error (solo en desarrollo)
                </summary>
                <pre style={{
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  color: '#ef4444',
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
