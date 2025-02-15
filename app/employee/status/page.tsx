import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Truck } from 'lucide-react'

const statusMap = {
  pending: { label: '待处理', color: 'bg-yellow-500' },
  approved: { label: '已审核', color: 'bg-blue-500' },
  shipped: { label: '已发货', color: 'bg-green-500' },
  completed: { label: '已完成', color: 'bg-gray-500' },
}

export default async function StatusPage() {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: application } = await supabase
    .from('gift_box_applications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!application) {
    redirect('/employee')
  }

  return (
    <div className="min-h-screen bg-[#FFF8EA]">
      <Navbar email={user.email || ''} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="festival-card">
            <CardHeader>
              <CardTitle>申请状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">礼盒类型</span>
                </div>
                <span>{application.box_type === 'regular' ? '常规礼盒' : '清真礼盒'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">领取方式</span>
                </div>
                <span>{application.delivery_method === 'pickup' ? '线下领取' : '线上邮寄'}</span>
              </div>

              {application.delivery_method === 'delivery' && (
                <>
                  <div className="space-y-2">
                    <div className="font-medium">收件信息</div>
                    <div className="text-sm text-gray-600">
                      <p>收件人: {application.delivery_recipient}</p>
                      <p>电话: {application.delivery_phone}</p>
                      <p>地址: {application.delivery_address}</p>
                    </div>
                  </div>

                  {application.tracking_number && (
                    <div className="space-y-2">
                      <div className="font-medium">快递信息</div>
                      <div className="text-sm text-gray-600">
                        <p>快递单号: {application.tracking_number}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="font-medium">当前状态</span>
                <Badge className={statusMap[application.status as keyof typeof statusMap].color}>
                  {statusMap[application.status as keyof typeof statusMap].label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
