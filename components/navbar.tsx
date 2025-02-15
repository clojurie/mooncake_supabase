'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { Moon } from 'lucide-react'

export default function Navbar({ email }: { email: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Moon className="h-6 w-6 text-orange-500" />
          <span className="text-lg font-medium">中秋礼盒申请系统</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{email}</span>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            退出
          </Button>
        </div>
      </div>
    </nav>
  )
}
