'use client'

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="relative flex flex-col items-center gap-8">
        {/* Rotating gradient ring */}
        <div className="relative h-36 w-36">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-100 via-orange-500 to-orange-900 animate-spin blur-[2px]" />
          <div className="absolute inset-3 rounded-full bg-white" />
        </div>

        {/* Orbiting dots */}
        <div className="absolute h-36 w-36 animate-spin-slow">
          <span className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-orange-300 animate-ping" />
          <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-orange-600 animate-ping delay-150" />
          <span className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-orange-900 animate-ping delay-300" />
        </div>

        {/* Animated loading text */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-orange-700">
            <span className="inline-block animate-bounce delay-0">L</span>
            <span className="inline-block animate-bounce delay-100">O</span>
            <span className="inline-block animate-bounce delay-200">A</span>
            <span className="inline-block animate-bounce delay-300">D</span>
            <span className="inline-block animate-bounce delay-400">I</span>
            <span className="inline-block animate-bounce delay-500">N</span>
            <span className="inline-block animate-bounce delay-600">G</span>
          </p>
          <p className="mt-1 text-xs text-orange-400 animate-pulse">
            Preparing your data…
          </p>
        </div>
      </div>
    </div>
  )
}
