import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  onError: (error: Error) => void;
  children: ReactNode;
}

/** Captura fallos del entorno 3D para activar el modo 2D sin perder la presentación. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[NOVATEK] Error en el entorno 3D', error, info.componentStack);
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
