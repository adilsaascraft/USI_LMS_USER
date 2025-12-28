'use client'

import { useEffect, useState } from 'react'
import { parseWebinarDate } from '@/lib/parseWebinarDate'

type Props = {
  startDate: string // DD/MM/YYYY
  startTime: string // hh:mm AM/PM
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ startDate, startTime }: Props) {
  const targetDate = parseWebinarDate(startDate, startTime)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft())

  function getTimeLeft(): TimeLeft | null {
    const diff = targetDate.getTime() - Date.now()
    if (diff <= 0) return null

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) return null

  const Item = ({ value, label }: { value: number; label: string }) => (
    <div
      className="
        flex flex-col items-center justify-center
        px-3 py-2
        rounded-lg
        border
        bg-blue-50
        border-blue-200
        min-w-[56px]
      "
    >
      <span className="text-sm font-bold text-blue-700">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-blue-600">
        {label}
      </span>
    </div>
  )

  return (
    <div className="mt-3 flex items-center gap-2">
      <Item value={timeLeft.days} label="Days" />
      <Item value={timeLeft.hours} label="Hrs" />
      <Item value={timeLeft.minutes} label="Min" />
      <Item value={timeLeft.seconds} label="Sec" />
    </div>
  )
}
