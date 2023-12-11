# This file is maintained by ChatGPT model and Humans - DO NOT CHANGE THESE LINES

Reglas del archivo, por favor realice una tarea y subtarea a la vez,
si una tarea es muy compleja, pruebe primero a dividirla en subtareas,
coloque [] para indicar si la tarea ya se cumplió

# Commons actions list

Utiliza esta lista como una guía para la toma de acciones o decisiones. Cada acción viene con una descripción clara y pasos detallados para facilitar su comprensión y ejecución.

## Crear una Nueva Herramienta

Descripción: Proceso para crear una nueva herramienta en el proyecto.

1. Analizar la estructura del directorio raíz (Profundidad: 12).
2. Revisar y analizar archivos `.tool.ts`.
3. Desarrollar la nueva herramienta.
4. Guardar el archivo con el nombre `new_tool_name.ts`.

## Investigación y Análisis

Descripción: Pasos para investigar y analizar archivos que pueden ser útiles para el proyecto.

1. Analizar la estructura del directorio raíz (Profundidad: 12).
2. Identificar archivos relevantes si no hay un mapa de directorio.
3. Revisar y entender el contenido de los archivos identificados.

## Desarrollo de LLM Utilizando LangChain, LCEL

Descripción: Pasos para crear un modelo de lenguaje utilizando LangChain y LCEL.

1. Investigar en internet sobre LangChain y LCEL.
2. Desarrollar el modelo paso a paso.

# TODOs Categorizados

## Herramientas a Crear

- [ ] Crear una Tool para ver el contenido de múltiples archivos a la vez, input array of paths, output list out path and content json array.
- [ ] Crear una Tool para leer un documento .doc y .docx, por rango de páginas.
- [ ] Crear una Tool para reescribir un fragmento específico de una página y un párrafo específico de un documento .doc o .docx
- [ ] Crear una Tool para copiar un directorio a un nuevo destino, solo si está vacío el destino, y omitir archivos del .gitignore si está presente en el directorio origen.

## Revisiones de Código

- [ ] src\scrape_web_ai_vision\web_agent.js -> Convertir a .tool.ts, y guardar archivo, sin omitir contenido!!
  - 1 - Revisar y entender el código de `web_agent.js`
  - 2- Crear una nueva tool: para `web_agent.ts`

## Investigaciones

- [ ] Review this on https://platform.openai.com/docs/actions, using the web_agent
      Multiple authentication schemas
      Actions now support multiple authentication schemas which can be set on a per-endpoint basis. This means you can have some endpoints that require authentication and some that don't.

## Registro de Cambios

- [Fecha] Cambio realizado

## Responsables

- [Nombre] Tarea asignada
