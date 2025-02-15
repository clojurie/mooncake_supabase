'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function ApplyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    boxType: 'regular',
    deliveryMethod: 'pickup',
    address: '',
    recipient: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('gift_box_applications').insert({
        user_id: user.id,
        box_type: formData.boxType,
        delivery_method: formData.deliveryMethod,
        delivery_address: formData.deliveryMethod === 'delivery' ? formData.address : null,
        delivery_recipient: formData.deliveryMethod === 'delivery' ? formData.recipient : null,
        delivery_phone: formData.deliveryMethod === 'delivery' ? formData.phone : null,
      })

      if (error) {
        if (error.message.includes('duplicate')) {
          toast({
            variant: "destructive",
            title: "申请失败",
            description: "您已经申请过礼盒了",
          })
        } else {
          toast({
            variant: "destructive",
            title: "申请失败",
            description: "请稍后重试",
          })
        }
        return
      }

      toast({
        title: "申请成功",
        description: "您的礼盒申请已提交",
      })
      router.push('/employee/status')
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
    <div className="min-h-screen bg-[#FFF8EA]">
      <Navbar email={''} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="festival-card">
            <CardHeader>
              <CardTitle>申请中秋礼盒</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label>礼盒类型</Label>
                  <RadioGroup
                    defaultValue={formData.boxType}
                    onValueChange={(value) => setFormData({ ...formData, boxType: value })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="regular" />
                      <Label htmlFor="regular">常规礼盒</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="halal" id="halal" />
                      <Label htmlFor="halal">清真礼盒</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>领取方式</Label>
                  <RadioGroup
                    defaultValue={formData.deliveryMethod}
                    onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">线下领取</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">线上邮寄</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.deliveryMethod === 'delivery' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipient">收件人</Label>
                      <Input
                        id="recipient"
                        value={formData.recipient}
                        onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                        className="festival-input mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">联系电话</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="festival-input mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">收货地址</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="festival-input mt-1"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full festival-button"
                  disabled={loading}
                >
                  {loading ? '提交中...' : '提交申请'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
