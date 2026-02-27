export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-slate-200 border-t-sky-600`} />
      {text && <p className="text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
    </div>
  )
}
