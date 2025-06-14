'use client'

import { useEffect, useState } from 'react'
import { useSupabaseService } from '@/services/api/supabaseService'
import type { Profile } from '@/interfaces'

export const useUserProfile = () => {
  const supabaseService = useSupabaseService()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load profile when supabase service instance changes
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      const profileData = await supabaseService.fetchUserProfile()

      setProfile(profileData)
      setLoading(false)
    }

    loadProfile()
  }, [supabaseService])

  return { profile, loading }
}
