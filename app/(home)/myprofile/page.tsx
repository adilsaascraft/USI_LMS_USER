'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import type { ProfileData } from '@/types/profile'
import { apiRequest } from '@/lib/apiRequest'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { getIndianFormattedDate } from '@/lib/formatIndianDate'

/* -------------------------------------------------------------------------- */
/*                               API → FORM                                   */
/* -------------------------------------------------------------------------- */
const mapApiToForm = (user: any): ProfileData => ({
  prefix: user.prefix || '',
  fullName: user.name || '',
  qualification: user.qualification || '',
  affiliationHospital: user.affiliation || '',
  mobile: user.mobile || '',
  email: user.email || '',
  country: user.country || '',
  state: user.state || '',
  city: user.city || '',
  pincode: user.pincode || '',
  profilePicture: user.profilePicture || '/avatar.png',
})

export default function MyProfilePage() {
  const { updateUser } = useAuthStore()

  const [form, setForm] = useState<ProfileData | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState('/profile.jpeg')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [loading, setLoading] = useState(true)

  /* -------------------------------------------------------------------------- */
  /*                               LOAD PROFILE                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await apiRequest<null, any>({
          endpoint: '/api/users/profile',
          method: 'GET',
        })

        const mapped = mapApiToForm(profile)
        setForm(mapped)
        setPreviewPhoto(mapped.profilePicture || '/avatar.png')

        updateUser({
          profilePicture: profile.profilePicture,
          name: profile.name,
          email: profile.email,
          mobile: profile.mobile,
          qualification: profile.qualification,
          affiliation: profile.affiliation,
          country: profile.country,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
        })
      } catch (err: any) {
        toast.error(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [updateUser])

  /* -------------------------------------------------------------------------- */
  /*                               HANDLERS                                     */
  /* -------------------------------------------------------------------------- */
  const handleChange = (key: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev!, [key]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setPhotoFile(file)
      setPreviewPhoto(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    try {
      setIsUpdating(true)

      const fd = new FormData()
      fd.append('prefix', form.prefix)
      fd.append('name', form.fullName)
      fd.append('qualification', form.qualification)
      fd.append('affiliation', form.affiliationHospital)
      fd.append('mobile', form.mobile)
      fd.append('country', form.country)
      fd.append('state', form.state)
      fd.append('city', form.city)
      fd.append('pincode', form.pincode)

      if (photoFile) fd.append('profilePicture', photoFile)

      const res = await apiRequest<FormData, any>({
        endpoint: '/api/users/profile',
        method: 'PUT',
        body: fd,
      })

      toast.success('Profile Updated', {
        description: getIndianFormattedDate(),
      })

      updateUser({
        profilePicture: res.user?.profilePicture ?? previewPhoto,
        name: res.user?.name,
        mobile: res.user?.mobile,
        qualification: res.user?.qualification,
        affiliation: res.user?.affiliation,
        country: res.user?.country,
        city: res.user?.city,
        state: res.user?.state,
        pincode: res.user?.pincode,
      })

      setIsEditMode(false)
      setPhotoFile(null)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsUpdating(false)
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               SKELETON                                     */
  /* -------------------------------------------------------------------------- */
  if (loading || !form) {
    return (
      <div className="bg-background rounded-2xl p-6 shadow-md">
        <div className="flex justify-center mb-6">
          <Skeleton className="w-28 h-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>
    )
  }

  /* -------------------------------------------------------------------------- */
  /*                               UI                                           */
  /* -------------------------------------------------------------------------- */
  return (
    <div className='p-4'>
      <h1 className="text-center mb-4 text-2xl font-semibold text-foreground">My Profile</h1>

      <div className="p-3 bg-background rounded-2xl shadow-md">
        {/* PHOTO */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-200">
            <img
              src={previewPhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {isEditMode && (
            <>
              <Label
                htmlFor="photoUpload"
                className="mt-2 text-sm text-orange-600 cursor-pointer"
              >
                Change Photo
              </Label>
              <Input
                id="photoUpload"
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </>
          )}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {(
            [
              ['prefix', 'Prefix'],
              ['fullName', 'Full Name'],
              ['qualification', 'Qualification'],
              ['affiliationHospital', 'Affiliation'],
              ['mobile', 'Mobile'],
              ['country', 'Country'],
              ['state', 'State'],
              ['city', 'City'],
              ['pincode', 'Pincode'],
            ] as [keyof ProfileData, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input
                value={form[key] || ''}
                disabled={!isEditMode}
                onChange={(e) => handleChange(key, e.target.value)}
                className={!isEditMode ? 'bg-gray-100' : ''}
              />
            </div>
          ))}

          {isEditMode && (
            <div className="col-span-full flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-orange-600 hover:bg-orange-700 px-10"
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          )}
        </form>

        {!isEditMode && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditMode(true)}
              className="px-10"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
