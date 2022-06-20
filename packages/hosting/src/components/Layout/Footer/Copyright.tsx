import { FC } from 'react'

export const CopyRight: FC = () => {
  const thisYear: number = new Date().getFullYear();

  return (
    <div className="text-gray-400 text-sm text-center border-t py-8">
      <p>© {thisYear} - Present 戦国IXAnary. All rights reserved.</p>
      <p>記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。</p>
      <p>Copyright © 2010-{thisYear} SQUARE ENIX CO., LTD. All Rights Reserved.</p>
    </div>
  )
}