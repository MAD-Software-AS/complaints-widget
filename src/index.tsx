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
  console.log('[MAD_WIDGET_DEBUG] createComponent called with config:', config)
  console.log(
    '[MAD_WIDGET_DEBUG] Current document.readyState:',
    document.readyState
  )
  console.log(
    '[MAD_WIDGET_DEBUG] Window object available:',
    typeof window !== 'undefined'
  )

  const template = createTemplate()
  console.log('[MAD_WIDGET_DEBUG] Template created:', template)

  // Generate unique tag name for each widget instance using global counter
  const uniqueTagName = `${WC_TAG_NAME}-${++(window as any).__MAD_WIDGET_COUNTER__}`
  console.log('[MAD_WIDGET_DEBUG] Unique tag name generated:', uniqueTagName)

  class MADComplaintsSection extends HTMLElement {
    private reactRoot: ReactDOM.Root | null = null

    constructor() {
      super()
      console.log('[MAD_WIDGET_DEBUG] Constructor called for:', uniqueTagName)
    }

    connectedCallback() {
      console.log(
        '[MAD_WIDGET_DEBUG] connectedCallback triggered for:',
        uniqueTagName
      )
      console.log('[MAD_WIDGET_DEBUG] this element:', this)
      console.log('[MAD_WIDGET_DEBUG] this.isConnected:', this.isConnected)
      console.log('[MAD_WIDGET_DEBUG] this.parentElement:', this.parentElement)
      console.log('[MAD_WIDGET_DEBUG] this.shadowRoot:', this.shadowRoot)

      // This is called when the element is added to the DOM
      const widgetConfig = widgetConfigMap.get(this)
      console.log('[MAD_WIDGET_DEBUG] Widget config retrieved:', widgetConfig)
      console.log(
        '[MAD_WIDGET_DEBUG] Config map size check - element in map:',
        widgetConfig !== undefined
      )

      if (!widgetConfig) {
        console.error(
          '[MAD_WIDGET_DEBUG] ERROR: Widget config not found in WeakMap'
        )
        console.error(
          '[MAD_WIDGET_DEBUG] Available keys in widgetConfigMap:',
          widgetConfigMap
        )
        return
      }

      console.log(
        '[MAD_WIDGET_DEBUG] Looking for target element with id:',
        widgetConfig.targetId
      )
      const targetElement = document.getElementById(widgetConfig.targetId)
      console.log('[MAD_WIDGET_DEBUG] Target element found:', targetElement)
      console.log('[MAD_WIDGET_DEBUG] Target element details:', {
        exists: !!targetElement,
        id: targetElement?.id,
        tagName: targetElement?.tagName,
        parentElement: targetElement?.parentElement,
        isConnected: targetElement?.isConnected
      })

      if (targetElement) {
        console.log('[MAD_WIDGET_DEBUG] Creating container div...')
        const container = document.createElement('div')
        container.classList.add('section')
        console.log('[MAD_WIDGET_DEBUG] Container created:', container)
        console.log(
          '[MAD_WIDGET_DEBUG] Container classes:',
          container.classList.toString()
        )

        console.log('[MAD_WIDGET_DEBUG] Attaching shadow DOM...')
        const shadowDOM = this.attachShadow({ mode: 'open' })
        console.log('[MAD_WIDGET_DEBUG] Shadow DOM attached:', shadowDOM)
        console.log(
          '[MAD_WIDGET_DEBUG] this.shadowRoot after attach:',
          this.shadowRoot
        )

        // Render the template in the shadow dom
        console.log('[MAD_WIDGET_DEBUG] Cloning template content...')
        shadowDOM.appendChild(template.content.cloneNode(true))
        console.log('[MAD_WIDGET_DEBUG] Template appended to shadow DOM')

        console.log('[MAD_WIDGET_DEBUG] Appending container to shadow DOM...')
        shadowDOM.appendChild(container)
        console.log(
          '[MAD_WIDGET_DEBUG] Container appended. Shadow DOM children:',
          shadowDOM.children.length
        )
        console.log(
          '[MAD_WIDGET_DEBUG] Shadow DOM innerHTML length:',
          shadowDOM.innerHTML.length
        )

        // Setup CSS vars now that shadowRoot exists
        console.log('[MAD_WIDGET_DEBUG] Setting up CSS vars...')
        setupCSSVars(shadowDOM, widgetConfig?.cssVars)
        console.log('[MAD_WIDGET_DEBUG] CSS vars setup complete')

        console.log('[MAD_WIDGET_DEBUG] Creating React root...')
        const root = ReactDOM.createRoot(container)
        this.reactRoot = root
        console.log('[MAD_WIDGET_DEBUG] React root created:', root)

        console.log('[MAD_WIDGET_DEBUG] Rendering React App with props:', {
          chainId: widgetConfig.chainId,
          env: widgetConfig.env || 'prod',
          redirectPath: widgetConfig.redirectPath
        })
        root.render(
          <React.StrictMode>
            <App
              chainId={widgetConfig.chainId}
              env={widgetConfig.env || 'prod'}
              redirectPath={widgetConfig.redirectPath}
            />
          </React.StrictMode>
        )
        console.log('[MAD_WIDGET_DEBUG] React App rendered successfully')
        console.log('[MAD_WIDGET_DEBUG] Final shadow DOM state:', {
          hasShadowRoot: !!this.shadowRoot,
          childrenCount: this.shadowRoot?.children.length,
          firstChild: this.shadowRoot?.firstChild,
          container: container,
          containerParent: container.parentElement
        })
      } else {
        console.error(
          '[MAD_WIDGET_DEBUG] ERROR: Element with id',
          `'${widgetConfig.targetId}'`,
          'not found.'
        )
        console.error('[MAD_WIDGET_DEBUG] Available elements in document:')
        console.error(
          '[MAD_WIDGET_DEBUG] All element IDs:',
          Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
        )
        console.error('[MAD_WIDGET_DEBUG] document.body:', document.body)
        console.error(
          '[MAD_WIDGET_DEBUG] document.body.innerHTML length:',
          document.body.innerHTML.length
        )
      }
    }

    disconnectedCallback() {
      console.log(
        '[MAD_WIDGET_DEBUG] disconnectedCallback triggered for:',
        uniqueTagName
      )
      // Cleanup React root when element is removed
      if (this.reactRoot) {
        console.log('[MAD_WIDGET_DEBUG] Unmounting React root...')
        this.reactRoot.unmount()
        this.reactRoot = null
        console.log('[MAD_WIDGET_DEBUG] React root unmounted')
      }
    }
  }

  // Define the custom element with unique name
  console.log('[MAD_WIDGET_DEBUG] Defining custom element:', uniqueTagName)
  try {
    customElements.define(uniqueTagName, MADComplaintsSection)
    console.log('[MAD_WIDGET_DEBUG] Custom element defined successfully')
  } catch (error) {
    console.error('[MAD_WIDGET_DEBUG] ERROR defining custom element:', error)
  }

  // create an instance of the component
  console.log('[MAD_WIDGET_DEBUG] Creating element instance...')
  const componentInstance = document.createElement(uniqueTagName)
  console.log('[MAD_WIDGET_DEBUG] Element instance created:', componentInstance)
  console.log('[MAD_WIDGET_DEBUG] Instance tagName:', componentInstance.tagName)
  console.log(
    '[MAD_WIDGET_DEBUG] Instance isConnected before append:',
    componentInstance.isConnected
  )

  // Store config in WeakMap before appending (so it's available in connectedCallback)
  console.log('[MAD_WIDGET_DEBUG] Storing config in WeakMap...')
  widgetConfigMap.set(componentInstance, config)
  console.log(
    '[MAD_WIDGET_DEBUG] Config stored. Verifying...',
    widgetConfigMap.get(componentInstance) !== undefined
  )

  // mount the component instance in the body element
  console.log('[MAD_WIDGET_DEBUG] Finding container for mounting...')
  const container = config?.targetId
    ? document.getElementById(config.targetId)
    : document.body
  console.log('[MAD_WIDGET_DEBUG] Container found:', container)
  console.log('[MAD_WIDGET_DEBUG] Container details:', {
    exists: !!container,
    id: container?.id || 'body',
    tagName: container?.tagName,
    isConnected: container?.isConnected,
    childrenCount: container?.children.length
  })

  if (container) {
    console.log(
      '[MAD_WIDGET_DEBUG] Appending component instance to container...'
    )
    container.appendChild(componentInstance)
    console.log('[MAD_WIDGET_DEBUG] Component instance appended')
    console.log(
      '[MAD_WIDGET_DEBUG] Instance isConnected after append:',
      componentInstance.isConnected
    )
    console.log(
      '[MAD_WIDGET_DEBUG] Container children after append:',
      container.children.length
    )
    console.log(
      '[MAD_WIDGET_DEBUG] Last child is our instance:',
      container.lastChild === componentInstance
    )
  } else {
    console.error(
      '[MAD_WIDGET_DEBUG] ERROR: Container not found, cannot append component'
    )
  }

  console.log('[MAD_WIDGET_DEBUG] createComponent finished, returning instance')
  return componentInstance
}
