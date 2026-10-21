export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/30 dark:border-slate-700/40 ${className}`}
            {...props}
        />
    )
}
