import * as React from 'react'

import App from './app/App'
import ReactDOM from 'react-dom/client'
import { createTemplate } from './template'
import setupCSSVars from './app/utils/setupCSSVars'

const WC_TAG_NAME = 'MAD_COMPLAINTS_WIDGET'

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
      // This is called when the element is added to the DOM
      const widgetConfig = widgetConfigMap.get(this)
      if (!widgetConfig) {
        console.error('Widget config not found')
        return
      }

      const targetElement = document.getElementById(widgetConfig.targetId)
      if (targetElement) {
        const container = document.createElement('div')
        container.classList.add('section')

        const shadowDOM = this.attachShadow({ mode: 'open' })
        // Render the template in the shadow dom
        shadowDOM.appendChild(template.content.cloneNode(true))
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
      } else {
        console.error(`Element with id '${widgetConfig.targetId}' not found.`)
      }
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

  // mount the component instance in the body element
  const container = config?.targetId
    ? document.getElementById(config.targetId)
    : document.body
  container?.appendChild(componentInstance)

  return componentInstance
}
