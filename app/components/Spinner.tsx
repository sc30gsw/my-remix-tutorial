import { FC } from 'react'

type SpinnerProps = Readonly<{
  color?: `border-${string}-${number}`
  size?: number
  weight?: number
  my?: number
}>

export const Spinner: FC<SpinnerProps> = ({
  color = 'border-blue-500',
  size = 10,
  weight,
  my,
}) => {
  return (
    <div className={`flex justify-center my-${my}`} aria-label="読み込み中">
      <div
        className={`animate-spin h-${size} w-${size} ${
          weight ? `border-${weight}` : 'border'
        }  ${color} rounded-full border-t-transparent`}
      />
    </div>
  )
}
