import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  title: '2024中秋礼盒申请系统',
  description: '公司员工中秋礼盒发放的Web浏览器应用',
}
