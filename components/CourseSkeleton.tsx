import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CourseSkeleton() {
  return (
    <div className="max-w-[1320px] mx-auto px-6 py-6 space-y-6">
      <Skeleton className="h-4 w-48" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <Card>
            <Skeleton className="aspect-video w-full" />
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-40" />
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
