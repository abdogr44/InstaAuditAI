'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { useSupabaseService } from '@/services/api/supabaseService'
import type { Profile } from '@/interfaces'

export const useUserProfile = () => {
  const supabaseService = useSupabaseService()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Loading profile when component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      const profileData = await supabaseService.fetchUserProfile()

      setProfile(profileData)
      setLoading(false)
    }

    loadProfile()
  }, [])

  return { profile, loading }
}
