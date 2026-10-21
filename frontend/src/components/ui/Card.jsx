import { forwardRef } from 'react'

export const Card = forwardRef(function Card(
    {
        children,
        className = '',
        hoverable = false,
        glass = false,
        ...props
    },
    ref
) {
    const glassStyle = glass
        ? 'glass-card'
        : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm'

    const hoverStyle = hoverable
        ? 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300'
        : ''

    return (
        <div
            ref={ref}
            className={`rounded-2xl overflow-hidden ${glassStyle} ${hoverStyle} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
})

export const CardHeader = forwardRef(function CardHeader(
    { children, className = '', ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
})

export const CardTitle = forwardRef(function CardTitle(
    { children, className = '', ...props },
    ref
) {
    return (
        <h3
            ref={ref}
            className={`text-lg font-bold text-slate-900 dark:text-white tracking-tight ${className}`}
            {...props}
        >
            {children}
        </h3>
    )
})

export const CardDescription = forwardRef(function CardDescription(
    { children, className = '', ...props },
    ref
) {
    return (
        <p
            ref={ref}
            className={`text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${className}`}
            {...props}
        >
            {children}
        </p>
    )
})

export const CardContent = forwardRef(function CardContent(
    { children, className = '', ...props },
    ref
) {
    return (
        <div ref={ref} className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
})

export const CardFooter = forwardRef(function CardFooter(
    { children, className = '', ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={`px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/80 flex items-center ${className}`}
            {...props}
        >
            {children}
        </div>
    )
})
