'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'

interface Application {
  id: string
  status: string
  delivery_method: string
  tracking_number: string | null
}

export default function AdminActions({ application }: { application: Application }) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [trackingNumber, setTrackingNumber] = useState(application.tracking_number || '')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const updateData: any = { status: newStatus }

      if (newStatus === 'shipped' && application.delivery_method === 'delivery') {
        if (!trackingNumber) {
          toast({
            variant: "destructive",
            title: "更新失败",
            description: "请输入快递单号",
          })
          return
        }
        updateData.tracking_number = trackingNumber
      }

      const { error } = await supabase
        .from('gift_box_applications')
        .update(updateData)
        .eq('id', application.id)

      if (error) throw error

      toast({
        title: "更新成功",
        description: "申请状态已更新",
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: "请稍后重试",
      })
    } finally {
      setLoading(false)
    }
  }

  if (application.status === 'completed') {
    return null
  }

  const nextAction = {
    pending: {
      label: '审核通过',
      status: 'approved',
      needTracking: false
    },
    approved: {
      label: '确认发货',
      status: 'shipped',
      needTracking: true
    },
    shipped: {
      label: '完成发放',
      status: 'completed',
      needTracking: false
    }
  }[application.status]

  if (!nextAction) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {nextAction.label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nextAction.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {nextAction.needTracking && application.delivery_method === 'delivery' && (
            <div className="space-y-2">
              <Label htmlFor="tracking">快递单号</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="请输入快递单号"
                required
              />
            </div>
          )}
          <Button
            className="w-full festival-button"
            onClick={() => handleUpdateStatus(nextAction.status)}
            disabled={loading}
          >
            {loading ? '处理中...' : '确认'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
