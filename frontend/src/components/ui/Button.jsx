import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

export const Button = forwardRef(function Button(
    {
        children,
        variant = 'primary',
        size = 'md',
        loading = false,
        disabled = false,
        leftIcon = null,
        rightIcon = null,
        className = '',
        type = 'button',
        ...props
    },
    ref
) {
    const baseStyles =
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer'

    const sizeStyles = {
        xs: 'text-xs px-2.5 py-1 gap-1.5',
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2 gap-2',
        lg: 'text-base px-5 py-2.5 gap-2.5'
    }

    const variantStyles = {
        primary:
            'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 focus-visible:ring-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400',
        secondary:
            'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus-visible:ring-slate-400',
        outline:
            'border border-slate-300 hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-200 focus-visible:ring-slate-400',
        ghost:
            'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus-visible:ring-slate-400',
        danger:
            'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 focus-visible:ring-rose-500',
        success:
            'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 focus-visible:ring-emerald-500',
        glass:
            'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-sm focus-visible:ring-sky-500'
    }

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span>{children}</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    )
})
