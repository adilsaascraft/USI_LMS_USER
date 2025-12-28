'use client'

import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/apiRequest'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

/* ================= TYPES ================= */

type FeedbackQuestion = {
  _id: string
  feedbackName: string
  options: string[]
}

type SubmittedAnswer = {
  feedbackId: string
  selectedOption: string
}

/* ================= COMPONENT ================= */

export default function Feedback({ webinarId }: { webinarId: string }) {
  const user = useAuthStore((s) => s.user)

  const [questions, setQuestions] = useState<FeedbackQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [otherFeedback, setOtherFeedback] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  /* ================= FETCH FEEDBACK ================= */

  useEffect(() => {
    if (!webinarId || !user?.id) return

    const fetchFeedback = async () => {
      try {
        const res = await apiRequest<any>({
          endpoint: `/api/webinars/${webinarId}/feedback`,
          method: 'GET',
        })

        const data = res?.data

        /* ✅ CORRECT MAPPING */
        const mappedQuestions: FeedbackQuestion[] =
          data?.feedbacks?.map((f: any) => ({
            _id: f._id,
            feedbackName: f.feedbackName,
            options: f.options || [],
          })) || []

        setQuestions(mappedQuestions)

        /* ✅ Already submitted feedback (if backend sends it) */
        if (data?.sendFeedbacks?.length) {
          const prevAnswers: Record<string, string> = {}

          data.sendFeedbacks.forEach((f: SubmittedAnswer) => {
            prevAnswers[f.feedbackId] = f.selectedOption
          })

          setAnswers(prevAnswers)
          setOtherFeedback(data.sendOtherFeedback || '')
          setSubmitted(true)
        }
      } catch (err) {
        console.error(err)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [webinarId, user?.id])

  /* ================= HANDLERS ================= */

  const onSelect = (feedbackId: string, option: string) => {
    if (submitted) return

    setAnswers((prev) => ({
      ...prev,
      [feedbackId]: option,
    }))
  }

  const allAnswered =
    !Array.isArray(questions) ||
    questions.length === 0 ||
    questions.every((q) => Boolean(answers[q._id]))

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Please login to submit feedback')
      return
    }

    if (!allAnswered) {
      toast.error('Please answer all feedback questions')
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        userId: user.id,
        sendFeedbacks: questions.map((q) => ({
          feedbackId: q._id,
          feedbackName: q.feedbackName,
          selectedOption: answers[q._id],
        })),
        sendOtherFeedback: otherFeedback.trim(),
      }

      await apiRequest({
        endpoint: `/api/webinars/${webinarId}/send-feedback`,
        method: 'POST',
        body: payload,
      })

      toast.success('Feedback submitted successfully')
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    )
  }

  /* ================= EMPTY ================= */

  if (!questions.length) {
    return (
      <p className="text-muted-foreground">
        No feedback questions available for this webinar.
      </p>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6 min-w-0">
      <h2 className="text-xl md:text-2xl font-semibold">Feedback</h2>

      {questions.map((q, idx) => (
        <Card key={q._id}>
          <CardHeader>
            <p className="text-sm font-medium">
              <span className="font-semibold mr-2">{idx + 1}.</span>
              {q.feedbackName}
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 text-sm ${
                    submitted
                      ? 'cursor-not-allowed opacity-70'
                      : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name={`feedback-${q._id}`}
                    checked={answers[q._id] === opt}
                    disabled={submitted}
                    onChange={() => onSelect(q._id, opt)}
                    className="h-4 w-4 accent-[#1F5C9E]"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* OTHER FEEDBACK */}
      <Card>
        <CardHeader>
          <p className="text-sm font-medium">Additional Comments</p>
        </CardHeader>

        <CardContent>
          <textarea
            value={otherFeedback}
            onChange={(e) => setOtherFeedback(e.target.value)}
            disabled={submitted}
            rows={4}
            className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F5C9E]"
            placeholder="Share your feedback..."
          />
        </CardContent>
      </Card>

      {/* SUBMIT */}
      {!submitted && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#1F5C9E] hover:bg-[#184a81]"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      )}

      {submitted && (
        <p className="text-green-600 text-sm font-medium">
          ✅ You have already submitted feedback for this webinar.
        </p>
      )}
    </div>
  )
}
