import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class AdminErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Admin Panel Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
                    <div className="rounded-full bg-red-100 p-4 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
                    <p className="text-slate-600 mb-6 max-w-md">
                        The admin panel encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-8 p-4 bg-slate-200 rounded-lg text-left text-xs overflow-auto max-w-2xl w-full">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
