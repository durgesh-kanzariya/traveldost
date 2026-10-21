import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

export function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 selection:bg-zinc-800 selection:text-zinc-100">
            <div className="w-full max-w-md p-8 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xl space-y-6 text-center">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500">
                        ERR_NOT_FOUND // CODE_404
                    </div>
                    <h1 className="font-mono text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        404
                    </h1>
                    <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Waypoint Unreachable
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                        The URL coordinates you navigated to do not exist or may have been relocated within the telemetry grid.
                    </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <Link
                        to="/dashboard"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-zinc-900 dark:bg-zinc-100 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Traveler Console</span>
                    </Link>
                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Landing Page</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
