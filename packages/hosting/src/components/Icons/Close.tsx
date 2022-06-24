import { FC } from "react"

interface Props {
  className?: string;
}
export const Close: FC<Props> = ({ className = "w-6 h-6" }) => (
  <svg className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="currentColor"
  >
    <path d="M12.45 37.65 10.35 35.55 21.9 24 10.35 12.45 12.45 10.35 24 21.9 35.55 10.35 37.65 12.45 26.1 24 37.65 35.55 35.55 37.65 24 26.1Z" />
  </svg>
)