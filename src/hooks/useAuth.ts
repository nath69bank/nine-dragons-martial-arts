import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'

export function useAuth() {
  const [user, setUser]             = useState<User | null>(null)
  const [profile, setProfile]       = useState<Profile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, belt:belts(*)')
      .eq('id', id)
      .single()
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[useAuth] Could not load profile for', id, error)
      setProfileError(error.message)
    } else {
      setProfileError(null)
    }
    setProfile(data)
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    return supabase.auth.signOut()
  }

  return { user, profile, profileError, loading, signIn, signOut, isAdmin: profile?.is_admin ?? false }
}
