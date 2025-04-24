import styles from './styles/index.css';

export function createTemplate(isSection?: boolean) {
    const template = document.createElement('template');

    template.innerHTML = `
      <style>${styles.toString()}</style>
      ${isSection ? '' : "<div class='mad-widget'><button id='widget-toggle-button' class='widget-toggle-button'>Alltid Fornøyd Garanti</button></div>"}
    `;
  
    return template;
  }