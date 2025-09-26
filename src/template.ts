import styles from './styles/index.css'

export function createTemplate() {
  const template = document.createElement('template')
  template.innerHTML = `<style>${styles.toString()}</style>`

  return template
}
