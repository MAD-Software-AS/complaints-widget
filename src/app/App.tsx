import React from 'react'
import Widget from './features/Widget/Widget'
import WidgetProvider from './contexts/Widget/WidgetProvider'

interface AppProps {
  chainId: string
  env: string
}

const App: React.FC<AppProps> = ({ chainId, env }) => {
  return (
    <WidgetProvider chainId={chainId} env={env}>
      <Widget />
    </WidgetProvider>
  )
}

export default App
