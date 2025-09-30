import React from 'react'

interface LoadingProps {
  containerHeight?: number
  spinnerSize?: number
  backgroundColor?: string
  spinnerColor?: string
}

const Loading: React.FC<LoadingProps> = ({
  backgroundColor,
  containerHeight,
  spinnerColor,
  spinnerSize
}) => {
  return (
    <div
      className="spinner-container"
      style={{ backgroundColor, height: `${containerHeight}px` }}
    >
      <div
        className="spinner"
        style={{
          color: spinnerColor,
          height: `${spinnerSize}px`,
          width: `${spinnerSize}px`
        }}
      />
    </div>
  )
}
export default Loading
