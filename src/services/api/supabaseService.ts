import type { Profile } from '@/interfaces'

import { handlerApiError } from '@/utils/errors/handlerApi'
import { supabase } from '@/lib/supabase'

export const useSupabaseService = () => {

  const fetchUserProfile = async (): Promise<Profile | null> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      return null
    }

    if (!user) {
      return null // Return null if there is no user.
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, first_name, last_name, email, picture')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(error)
      return null // Return null on error.
    }

    return Array.isArray(data) && data.length > 0 ? data[0] : data ?? {} // Return the user profile data or null if undefined.
  }

  const loginWithLinkedIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${process.env.NEXT_SITE_URL}auth/callback`,
        },
      })
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
    }
  }

  const loginWithGithub = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `auth/callback`,
        },
      })
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      return { error }
    } catch (error: unknown) {
      // Specify error as unknown here
      handlerApiError(error)
    }
  }

  return {
    fetchUserProfile,

    loginWithGithub,
    loginWithLinkedIn,
    logout,
  }
}
