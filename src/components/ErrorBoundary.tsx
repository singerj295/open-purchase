'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class OrderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('訂單頁面錯誤:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          color: '#ef4444'
        }}>
          <h2>頁面出錯</h2>
          <p>請檢查 console (F12) 或者重新整理頁面</p>
          {this.state.error && (
            <details style={{ 
              marginTop: '20px',
              textAlign: 'left',
              background: '#fef2f2',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>錯誤詳情</summary>
              <pre style={{ 
                marginTop: '10px',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#2d9e6d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            重新整理
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
