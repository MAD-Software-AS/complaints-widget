import * as React from 'react'

import App from './app/App'
import ReactDOM from 'react-dom/client'
import { createTemplate } from './template'
import setupCSSVars from './app/utils/setupCSSVars'

const WC_TAG_NAME = 'mad-complaints-widget'

// Global counter to ensure uniqueness across all widget instances
if (typeof window !== 'undefined' && !(window as any).__MAD_WIDGET_COUNTER__) {
  ;(window as any).__MAD_WIDGET_COUNTER__ = 0
}

// Map to store config for each widget instance by tag name
const widgetConfigMap = new Map<string, any>()

export default function createComponent(config: any) {
  const template = createTemplate()

  // Generate unique tag name for each widget instance using global counter
  const uniqueTagName = `${WC_TAG_NAME}-${++(window as any).__MAD_WIDGET_COUNTER__}`

  // Store config for this instance before defining the class
  widgetConfigMap.set(uniqueTagName, config)

  class MADComplaintsSection extends HTMLElement {
    constructor() {
      super()

      // Get config from map using the tag name
      const widgetConfig = widgetConfigMap.get(uniqueTagName)
      if (!widgetConfig) {
        console.error('Widget config not found')
        return
      }

      const targetElement = document.getElementById(widgetConfig.targetId)
      if (targetElement) {
        const container = document.createElement('div')
        container.classList.add('section')
        targetElement.appendChild(container)

        this.renderApp(container, widgetConfig)
      } else {
        console.error(`Element with id '${widgetConfig.targetId}' not found.`)
      }
    }

    renderApp(container: HTMLDivElement, widgetConfig: any) {
      if (!container) return

      const shadowDOM = this.attachShadow({ mode: 'open' })
      // Render the template in the shadow dom
      shadowDOM.appendChild(template.content.cloneNode(true))
      shadowDOM.appendChild(container)

      // Setup CSS vars now that shadowRoot exists
      setupCSSVars(shadowDOM, widgetConfig?.cssVars)

      const root = ReactDOM.createRoot(container)
      root.render(
        <React.StrictMode>
          <App
            chainId={widgetConfig.chainId}
            env={widgetConfig.env || 'prod'}
            redirectPath={widgetConfig.redirectPath}
          />
        </React.StrictMode>
      )
    }
  }

  // Define the custom element with unique name
  if (!customElements.get(uniqueTagName)) {
    customElements.define(uniqueTagName, MADComplaintsSection)
  }

  // create an instance of the component
  const componentInstance = document.createElement(uniqueTagName)

  // mount the component instance in the body element
  const container = config?.targetId
    ? document.getElementById(config.targetId)
    : document.body
  container?.appendChild(componentInstance)

  return componentInstance
}
