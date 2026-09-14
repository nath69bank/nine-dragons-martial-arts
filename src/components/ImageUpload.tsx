import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Loader2, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (url: string) => void
  folder: string
  placeholder?: string
}

/** URL field + optional file upload to the `dojo-media` Supabase Storage bucket. */
export default function ImageUpload({ value, onChange, folder, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    const ext  = file.name.split('.').pop() || 'jpg'
    const path = `${folder}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('dojo-media').upload(path, file, { cacheControl: '3600' })
    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('dojo-media').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? 'Image URL'}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 text-foreground/70 hover:bg-white/20 text-sm disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {value && (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="" className="h-24 rounded-lg object-cover border border-white/10" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-black/80 text-foreground/70 hover:text-red-400"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
