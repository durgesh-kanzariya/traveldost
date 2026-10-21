export function Badge({
    children,
    variant = 'default',
    size = 'sm',
    dot = false,
    className = '',
    ...props
}) {
    const baseStyles = 'inline-flex items-center font-semibold rounded-full uppercase tracking-wider select-none'

    const sizeStyles = {
        xs: 'text-[9px] px-2 py-0.5 gap-1',
        sm: 'text-[10px] px-2.5 py-0.5 gap-1.5',
        md: 'text-xs px-3 py-1 gap-1.5'
    }

    const variantStyles = {
        default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        primary: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
        danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
        info: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50',
        outline: 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
    }

    const dotColors = {
        default: 'bg-slate-500',
        primary: 'bg-sky-500',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-rose-500',
        info: 'bg-indigo-500',
        outline: 'bg-slate-400'
    }

    return (
        <span
            className={`${baseStyles} ${sizeStyles[size] || sizeStyles.sm} ${variantStyles[variant] || variantStyles.default} ${className}`}
            {...props}
        >
            {dot && (
                <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant] || 'bg-current'} shrink-0`} />
            )}
            {children}
        </span>
    )
}
