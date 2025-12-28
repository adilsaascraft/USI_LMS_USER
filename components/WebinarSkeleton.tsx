import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function WebinarSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <Skeleton className="h-4 w-40" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          <Card>
            <Skeleton className="aspect-video w-full rounded-xl" />
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="flex justify-center">
            <Skeleton className="h-20 w-20 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
