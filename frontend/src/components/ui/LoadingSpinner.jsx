export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 animate-in fade-in duration-200">
      <div className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-slate-200 dark:border-slate-800 border-t-sky-500`} />
      {text && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-3 border-slate-200 dark:border-slate-800 border-t-sky-500" />
    </div>
  )
}
