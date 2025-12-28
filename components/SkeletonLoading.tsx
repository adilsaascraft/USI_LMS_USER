'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const SKELETON_COUNT = 9

export default function SkeletonLoading() {
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
            className="p-0 rounded-2xl overflow-hidden bg-white shadow-md"
          >
            {/* Image */}
            <Skeleton className="h-44 w-full" />

            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
