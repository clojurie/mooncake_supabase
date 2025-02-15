'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "登录失败",
          description: "邮箱或密码错误,请重试",
        })
        return
      }

      // 根据用户角色重定向
      if (email === 'admin@example.com') {
        router.push('/admin')
      } else {
        router.push('/employee')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "系统错误",
        description: "请稍后重试",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8EA] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="https://image.coze.run/?prompt=A%20traditional%20Chinese%20Mid-Autumn%20Festival%20illustration%20with%20mooncakes,%20lanterns,%20and%20a%20full%20moon%20in%20warm%20colors&image_size=square"
            alt="中秋节"
            width={120}
            height={120}
            className="mx-auto rounded-full shadow-lg"
          />
        </div>

        <Card className="festival-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">2024中秋礼盒申请</CardTitle>
            <CardDescription className="text-center">
              请使用员工邮箱登录系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="festival-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="festival-input"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full festival-button"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="text-xs	text-muted-foreground text-center">
          员工邮箱：e001@example.com ~ e0010@example.com，密码同邮箱<br/>
          管理邮箱：admin@example.com，密码同邮箱
        </div>
      </div>
    </div>
  )
}
