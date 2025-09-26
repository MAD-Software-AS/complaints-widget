const setupCSSVars = (shadowRoot: ShadowRoot, varsConfig: any) => {
  const shadowElement = shadowRoot.host as HTMLElement

  const splitByCamelCaseAndNumberString = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
      .toLowerCase()
  }

  const setCSSVar = (name: string, value: string) => {
    const cssVarName = `--${splitByCamelCaseAndNumberString(name)}`
    shadowElement.style.setProperty(cssVarName, value)
  }
  const setCSSVars = (vars: Record<string, string>) => {
    Object.entries(vars).forEach(([key, value]) => {
      setCSSVar(key, value)
    })
  }

  setCSSVars(varsConfig)
}

export default setupCSSVars
