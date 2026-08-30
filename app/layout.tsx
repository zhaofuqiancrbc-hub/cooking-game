import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '小小厨神｜番茄炒鸡蛋',
  description: '拖拽切菜、撒调料和炒菜的趣味厨房小游戏。',
  openGraph: { title: '小小厨神', description: '一起来做番茄炒鸡蛋！', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: '小小厨神', description: '一起来做番茄炒鸡蛋！', images: ['/og.png'] },
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }
