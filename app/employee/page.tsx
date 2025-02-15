import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Gift, TruckIcon } from 'lucide-react'

export default async function EmployeePage() {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 获取用户的申请记录
  const { data: application } = await supabase
    .from('gift_box_applications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#FFF8EA]">
      <Navbar email={user.email || ''} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Image
              src="https://image.coze.run/?prompt=A%20modern%20gift%20box%20with%20traditional%20Chinese%20elements,%20mooncakes%20and%20tea%20set%20in%20elegant%20packaging&image_size=square"
              alt="礼盒展示"
              width={200}
              height={200}
              className="mx-auto rounded-lg shadow-lg"
            />
            <h1 className="text-3xl font-bold text-gray-800">2024中秋礼盒</h1>
            <p className="text-gray-600">欢迎使用中秋礼盒申请系统</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-orange-500" />
                  <span>申请礼盒</span>
                </CardTitle>
                <CardDescription>
                  点击下方按钮开始申请您的中秋礼盒
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/employee/apply">
                  <Button className="w-full festival-button" disabled={!!application}>
                    {application ? '已申请' : '立即申请'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TruckIcon className="h-5 w-5 text-orange-500" />
                  <span>申请状态</span>
                </CardTitle>
                <CardDescription>
                  查看您的礼盒申请进度
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/employee/status">
                  <Button className="w-full festival-button">
                    查看状态
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
