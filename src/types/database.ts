export type BeltStatus = 'active' | 'inactive' | 'pending'

export interface Belt {
  id: string
  name: string
  order_index: number
  color_hex: string
  description: string | null
  requirements: string | null
  created_at: string
  belt_tags?: BeltTag[]
}

export interface BeltTag {
  id: string
  belt_id: string
  tag: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  belt_id: string | null
  status: BeltStatus
  is_admin: boolean
  joined_at: string
  notes: string | null
  belt?: Belt
}

export interface Lesson {
  id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  belt_id: string | null
  is_published: boolean
  created_at: string
  belt?: Belt
}

export interface NutritionGuide {
  id: string
  title: string
  content: string | null
  category: string | null
  is_published: boolean
  created_at: string
}

export interface GradingHistory {
  id: string
  profile_id: string
  from_belt_id: string | null
  to_belt_id: string | null
  graded_at: string
  notes: string | null
  from_belt?: Belt
  to_belt?: Belt
}

// Supabase generic Database type (used by createClient)
export type Database = {
  public: {
    Tables: {
      belts:            { Row: Belt;            Insert: Omit<Belt, 'id' | 'created_at' | 'belt_tags'>; Update: Partial<Omit<Belt, 'id' | 'created_at' | 'belt_tags'>> }
      belt_tags:        { Row: BeltTag;         Insert: Omit<BeltTag, 'id'>;                            Update: Partial<Omit<BeltTag, 'id'>> }
      profiles:         { Row: Profile;         Insert: Omit<Profile, 'joined_at' | 'belt'>;            Update: Partial<Omit<Profile, 'id' | 'joined_at' | 'belt'>> }
      lessons:          { Row: Lesson;          Insert: Omit<Lesson, 'id' | 'created_at' | 'belt'>;     Update: Partial<Omit<Lesson, 'id' | 'created_at' | 'belt'>> }
      nutrition_guides: { Row: NutritionGuide;  Insert: Omit<NutritionGuide, 'id' | 'created_at'>;     Update: Partial<Omit<NutritionGuide, 'id' | 'created_at'>> }
      grading_history:  { Row: GradingHistory;  Insert: Omit<GradingHistory, 'id' | 'from_belt' | 'to_belt'>; Update: Partial<Omit<GradingHistory, 'id' | 'from_belt' | 'to_belt'>> }
    }
  }
}
