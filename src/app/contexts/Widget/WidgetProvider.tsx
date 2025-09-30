import React, { useState } from 'react'

import WidgetContext from './WidgetContext'
import useGetWidgetContextData from './useGetWidgetContextData'

interface WidgetProviderProps {
  children: React.ReactElement | React.ReactElement[] | string
  chainId: string
  env: string
}

const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  chainId,
  env
}) => {
  const [selectedSalon, setSelectedSalon] = useState<string | null>(null)
  const [isBookingModalOpened, setIsBookingModalOpened] = useState(false)
  const [bookingModalContext, setBookingModalContext] = useState<{
    date: string
    price: number
    startTime: string
    endTime: string
  } | null>(null)
  const widgetState = useGetWidgetContextData(chainId, setSelectedSalon, env)

  return (
    <WidgetContext.Provider
      value={{
        ...widgetState,
        selectedSalon,
        setSelectedSalon,
        isBookingModalOpened,
        setIsBookingModalOpened,
        bookingModalContext,
        setBookingModalContext,
        env
      }}
    >
      {children}
    </WidgetContext.Provider>
  )
}

export default WidgetProvider
