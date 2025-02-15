import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import AdminActions from './actions'

const statusMap = {
  pending: { label: '待处理', color: 'bg-yellow-500' },
  approved: { label: '已审核', color: 'bg-blue-500' },
  shipped: { label: '已发货', color: 'bg-green-500' },
  completed: { label: '已完成', color: 'bg-gray-500' },
}

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@example.com') {
    redirect('/login')
  }

  // 获取所有申请记录
  const { data: applications } = await supabase
    .from('gift_box_applications')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FFF8EA]">
      <Navbar email={user.email || ''} />

      <main className="container mx-auto px-4 py-8">
        <Card className="festival-card">
          <CardHeader>
            <CardTitle>礼盒申请管理</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>申请人</TableHead>
                  <TableHead>礼盒类型</TableHead>
                  <TableHead>领取方式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>申请时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      {app.box_type === 'regular' ? '常规礼盒' : '清真礼盒'}
                    </TableCell>
                    <TableCell>
                      {app.delivery_method === 'pickup' ? '线下领取' : '线上邮寄'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusMap[app.status as keyof typeof statusMap].color}>
                        {statusMap[app.status as keyof typeof statusMap].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <AdminActions application={app} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
