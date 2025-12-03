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

// Module-level WeakMap to store config for each widget instance
const widgetConfigMap = new WeakMap<HTMLElement, any>()

export default function createComponent(config: any) {
  const template = createTemplate()

  // Generate unique tag name for each widget instance using global counter
  const uniqueTagName = `${WC_TAG_NAME}-${++(window as any).__MAD_WIDGET_COUNTER__}`

  class MADComplaintsSection extends HTMLElement {
    private reactRoot: ReactDOM.Root | null = null

    connectedCallback() {
      // Don't re-render if already rendered
      if (this.shadowRoot) {
        return
      }

      const widgetConfig = widgetConfigMap.get(this)
      if (!widgetConfig) {
        console.error('Widget config not found')
        return
      }

      const targetElement = document.getElementById(widgetConfig.targetId)
      if (!targetElement) {
        console.error(`Element with id '${widgetConfig.targetId}' not found.`)
        return
      }

      // Create container div and append to target element first (as in original)
      const container = document.createElement('div')
      container.classList.add('section')
      targetElement.appendChild(container)

      // Then create shadow DOM and move container into it
      const shadowDOM = this.attachShadow({ mode: 'open' })
      // Render the template in the shadow dom
      shadowDOM.appendChild(template.content.cloneNode(true))
      // Move container from targetElement into shadow DOM (this removes it from targetElement)
      shadowDOM.appendChild(container)

      // Setup CSS vars now that shadowRoot exists
      setupCSSVars(shadowDOM, widgetConfig?.cssVars)

      const root = ReactDOM.createRoot(container)
      this.reactRoot = root
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

    disconnectedCallback() {
      // Cleanup React root when element is removed
      if (this.reactRoot) {
        this.reactRoot.unmount()
        this.reactRoot = null
      }
    }
  }

  // Define the custom element with unique name
  customElements.define(uniqueTagName, MADComplaintsSection)

  // create an instance of the component
  const componentInstance = document.createElement(uniqueTagName)

  // Store config in WeakMap before appending (so it's available in connectedCallback)
  widgetConfigMap.set(componentInstance, config)

  // mount the component instance in the target element
  // When this happens, connectedCallback will fire
  const container = config?.targetId
    ? document.getElementById(config.targetId)
    : document.body
  container?.appendChild(componentInstance)

  return componentInstance
}
