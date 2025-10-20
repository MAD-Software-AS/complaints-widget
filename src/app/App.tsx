import React from 'react'
import Widget from './features/Widget/Widget'
import WidgetProvider from './contexts/Widget/WidgetProvider'

interface AppProps {
  chainId: string
  env: string
  redirectPath?: string
}

const App: React.FC<AppProps> = ({ chainId, env, redirectPath }) => {
  return (
    <WidgetProvider chainId={chainId} env={env}>
      <Widget redirectPath={redirectPath} />
    </WidgetProvider>
  )
}

export default App
