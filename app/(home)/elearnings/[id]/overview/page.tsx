'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  PlayCircle,
  FileText,
  ImageIcon,
  Lock,
} from 'lucide-react'

import { apiRequest } from '@/lib/apiRequest'
import { useAuthStore } from '@/stores/authStore'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import CourseSkeleton from '@/components/CourseSkeleton'


/* ================= TYPES ================= */

interface CourseApi {
  _id: string
  courseName: string
  courseImage: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  streamLink: string
  description: string
  status: string
}

interface CourseModule {
  _id: string
  courseModuleName: string
  contentType: 'video' | 'document' | 'photos'
  contentLink: string
  duration?: string
}

interface CourseWeek {
  _id: string
  weekCategoryName: string
  modules: CourseModule[]
}

/* ================= PAGE ================= */

export default function ElearningDetailPage() {
  const { id: courseId } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const [course, setCourse] = useState<CourseApi | null>(null)
  const [weeks, setWeeks] = useState<CourseWeek[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  /* ================= FETCH & GUARD ================= */

  useEffect(() => {
    if (!courseId || !user?.id) return

    const fetchData = async () => {
      try {
        const [courseRes, weeksRes, accessRes] = await Promise.all([
          apiRequest({ endpoint: `/api/courses/${courseId}`, method: 'GET' }),
          apiRequest({
            endpoint: `/api/courses/${courseId}/weeks-with-modules`,
            method: 'GET',
          }),
          apiRequest({
            endpoint: `/api/course/registrations/${user.id}`,
            method: 'GET',
          }),
        ])

        const registeredCourseIds = accessRes.data.map((r: any) => r.course._id)

        if (!registeredCourseIds.includes(courseId)) {
          setHasAccess(false)
          setLoading(false)
          return
        }

        setHasAccess(true)
        setCourse(courseRes.data)
        setWeeks(weeksRes.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, user?.id])

  /* ================= STATES ================= */

  if (loading) return <CourseSkeleton />

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <Lock className="text-red-500" size={48} />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-sm text-gray-600">
          You are not registered for this course.
        </p>
        <Button onClick={() => router.push('/elearnings')} className='bg-orange-600 hover:bg-orange-700'>Go Back</Button>
      </div>
    )
  }

  if (!course) {
    return <div className="p-8 text-center">Course not found</div>
  }

  /* ================= HELPERS ================= */

  const getIcon = (type: CourseModule['contentType']) => {
    switch (type) {
      case 'video':
        return <PlayCircle size={18} className="text-blue-600" />
      case 'document':
        return <FileText size={18} className="text-green-600" />
      case 'photos':
        return <ImageIcon size={18} className="text-purple-600" />
    }
  }

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ================= BREADCRUMB ================= */}
      <div className="text-sm">
        <button
          onClick={() => router.push('/elearnings')}
          className="text-gray-500 hover:text-blue-600"
        >
          E-learning Courses
        </button>{' '}
        / <span className="text-blue-600">{course.courseName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* ================= LEFT ================= */}
        <div className="space-y-6 min-w-0">
          {/* VIDEO PLAYER */}
          <div className="rounded-2xl overflow-hidden aspect-video shadow">
            <iframe
              src={course.streamLink}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>

          {/* META */}
          <Card>
            <CardHeader>
              <h1 className="text-lg font-semibold">{course.courseName}</h1>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays size={14} />
                {course.startDate} - {course.endDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                {course.startTime} - {course.endTime}
              </div>
              <Button disabled className="w-full">
                <CheckCircle2 size={16} />
                Registered
              </Button>
            </CardContent>
          </Card>

          {/* DESCRIPTION */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold">About this course</h2>
            </CardHeader>
            <CardContent
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </Card>

          {/* CONTENT */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Course Content</h2>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-3">
                {weeks.map((week) => (
                  <AccordionItem key={week._id} value={week._id}>
                    <AccordionTrigger>{week.weekCategoryName}</AccordionTrigger>
                    <AccordionContent>
                      {week.modules.map((m) => (
                        <div
                          key={m._id}
                          className="flex justify-between items-center py-2"
                        >
                          <span className="flex gap-2 items-center">
                            {getIcon(m.contentType)}
                            {m.courseModuleName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {m.duration}
                          </span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
        <Card className="h-fit sticky top-6 text-center">
          <CardContent className="p-6">
            <p className="text-xs text-gray-500 mb-4">EDUCATIONAL GRANT BY</p>
            <Image
              src="/Sun_Pharma.png"
              alt="Sun Pharma"
              width={80}
              height={80}
              className="mx-auto"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
