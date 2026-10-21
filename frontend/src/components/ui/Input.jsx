import { forwardRef, useId } from 'react'

export const Input = forwardRef(function Input(
    {
        label,
        id,
        error,
        helperText,
        leftIcon = null,
        rightIcon = null,
        className = '',
        disabled = false,
        type = 'text',
        ...props
    },
    ref
) {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : helperText ? helperId : undefined}
                    className={`w-full rounded-xl border transition-all duration-200 text-sm px-3.5 py-2.5 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                        leftIcon ? 'pl-10' : ''
                    } ${rightIcon ? 'pr-10' : ''} ${
                        error
                            ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                    } ${className}`}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p id={errorId} className="text-xs text-rose-500 dark:text-rose-400 mt-1.5 font-medium flex items-center gap-1">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={helperId} className="text-xs text-slate-400 mt-1.5">
                    {helperText}
                </p>
            )}
        </div>
    )
})
