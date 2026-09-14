export type BeltStatus = 'active' | 'inactive' | 'pending'

export interface Belt {
  id: string
  name: string
  order_index: number
  color_hex: string
  description: string | null
  requirements: string | null
  typical_days_to_next: number
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

export interface PublicSession {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  category: string
  is_published: boolean
  display_order: number
  created_at: string
}

export interface NewsPostAuthor {
  full_name: string | null
  email: string | null
  is_admin: boolean
  belt?: Pick<Belt, 'name' | 'color_hex'> | null
}

export interface NewsComment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  author?: NewsPostAuthor
}

export interface NewsLike {
  post_id: string
  profile_id: string
  created_at: string
}

export interface NewsPost {
  id: string
  author_id: string | null
  content: string
  image_url: string | null
  is_pinned: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  author?: NewsPostAuthor
  news_comments?: NewsComment[]
  news_likes?: { profile_id: string }[]
}

export interface Attendance {
  id: string
  profile_id: string
  class_date: string
  class_label: string
  marked_by: string | null
  created_at: string
  profile?: Pick<Profile, 'full_name' | 'email'>
}

export type NotificationType = 'news_post' | 'comment' | 'grading' | 'attendance' | 'general'

export interface Notification {
  id: string
  profile_id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author_id: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author?: Pick<Profile, 'full_name'>
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
      public_sessions:  { Row: PublicSession;   Insert: Omit<PublicSession, 'id' | 'created_at'>;               Update: Partial<Omit<PublicSession, 'id' | 'created_at'>> }
      news_posts:       { Row: NewsPost;        Insert: Omit<NewsPost, 'id' | 'created_at' | 'updated_at' | 'author' | 'news_comments' | 'news_likes'>; Update: Partial<Omit<NewsPost, 'id' | 'created_at' | 'updated_at' | 'author' | 'news_comments' | 'news_likes'>> }
      news_comments:    { Row: NewsComment;     Insert: Omit<NewsComment, 'id' | 'created_at' | 'author'>;      Update: Partial<Omit<NewsComment, 'id' | 'created_at' | 'author'>> }
      news_likes:       { Row: NewsLike;        Insert: Omit<NewsLike, 'created_at'>;                           Update: Partial<Omit<NewsLike, 'created_at'>> }
      attendance:       { Row: Attendance;      Insert: Omit<Attendance, 'id' | 'created_at' | 'profile'>;      Update: Partial<Omit<Attendance, 'id' | 'created_at' | 'profile'>> }
      notifications:    { Row: Notification;    Insert: Omit<Notification, 'id' | 'created_at'>;                Update: Partial<Omit<Notification, 'id' | 'created_at'>> }
      blog_posts:       { Row: BlogPost;        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author'>; Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author'>> }
    }
  }
}
