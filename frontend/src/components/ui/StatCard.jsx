export function StatCard({
    title,
    value,
    subtitle = null,
    icon: Icon = null,
    trend = null,
    color = 'sky',
    className = ''
}) {
    const colorStyles = {
        sky: {
            iconBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40',
            badge: 'text-sky-600 dark:text-sky-400'
        },
        indigo: {
            iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40',
            badge: 'text-indigo-600 dark:text-indigo-400'
        },
        emerald: {
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40',
            badge: 'text-emerald-600 dark:text-emerald-400'
        },
        amber: {
            iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40',
            badge: 'text-amber-600 dark:text-amber-400'
        },
        rose: {
            iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40',
            badge: 'text-rose-600 dark:text-rose-400'
        },
        violet: {
            iconBg: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/40',
            badge: 'text-violet-600 dark:text-violet-400'
        }
    }

    const currentStyle = colorStyles[color] || colorStyles.sky

    return (
        <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                        {value}
                    </h4>
                </div>
                {Icon && (
                    <div className={`p-2.5 rounded-xl ${currentStyle.iconBg} shrink-0`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>

            {(subtitle || trend) && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    {subtitle && <span>{subtitle}</span>}
                    {trend && (
                        <span className={`font-semibold ml-auto ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {trend.positive ? '+' : ''}{trend.value}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
