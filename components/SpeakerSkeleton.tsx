'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

const SKELETON_COUNT = 9

export default function SpeakerSkeleton() {
  return (
    <div className="p-6">
      {/* Title */}
      <Skeleton className="h-7 w-40 mb-6" />

      {/* Search */}
      <Skeleton className="h-10 w-full max-w-sm mb-8 rounded-lg" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Card
            key={i}
            className="rounded-2xl p-4 bg-white shadow-md flex gap-4"
          >
            <Skeleton className="h-16 w-16 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
