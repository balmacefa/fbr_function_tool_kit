# Directorio: src\scrape_web_ai_vision

## Archivos y Resúmenes

1. **screenshot.js**:
   - Utiliza `puppeteer-extra` y `puppeteer-extra-plugin-stealth`.
   - Navega a una URL especificada y toma una captura de pantalla completa.
   - Configura un viewport y espera un tiempo antes de realizar la captura.

2. **vison_scraper.py**:
   - Utiliza OpenAI y un script en Node.js para capturar imágenes de sitios web.
   - Convierte las imágenes a base64 y las procesa con el modelo `gpt-4-vision-preview`.
   - Extrae información de las imágenes basándose en instrucciones del usuario.

3. **web_agent.js**:
   - Integra Puppeteer, OpenAI, y herramientas adicionales para automatizar la navegación web.
   - Utiliza Puppeteer para capturar pantallas, con enlaces resaltados y posibilidad de interacción.
   - Emplea OpenAI para interpretar instrucciones y responder adecuadamente.