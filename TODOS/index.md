# This file is maintained by ChatGPT model and Humans - DO NOT CHANGE THESE LINES

Reglas del archivo, por favor realice una tarea y subtarea a la vez,
si una tarea es muy compleja, pruebe primero a dividirla en subtareas,
coloque [] para indicar si la tarea ya se cumpli�

## Reglas actualizadas del documento

- Antes de modificar o crear un documento, se recomienda realizar un `git branch check out` para asegurarse de trabajar sobre una copia del proyecto, y no sobre el proyecto principal.

# Commons actions list

Utiliza esta lista como una gu�a para la toma de acciones o decisiones. Cada acci�n viene con una descripci�n clara y pasos detallados para facilitar su comprensi�n y ejecuci�n.

## Crear una Nueva Herramienta

Descripci�n: Proceso para crear una nueva herramienta en el proyecto.

1. Analizar la estructura del directorio ra�z (Profundidad: 12).
2. Revisar y analizar archivos `.tool.ts`.
3. Desarrollar la nueva herramienta.
4. Guardar el archivo con el nombre `new_tool_name.ts`.

## Investigaci�n y An�lisis

Descripci�n: Pasos para investigar y analizar archivos que pueden ser �tiles para el proyecto.

1. Analizar la estructura del directorio ra�z (Profundidad: 12).
2. Identificar archivos relevantes si no hay un mapa de directorio.
3. Revisar y entender el contenido de los archivos identificados.

## Generar un Agente Nuevo

# TODO

- [x] TODO A01 - Ver contenido del documento `src\ChatHTMX\views\Readme.md`, y crear una endpoint para htmx que lista los posibles Agents,
  del archivo `src\ChatHTMX\AssistantsFactory.ts`.
  Debes hacer loops sobre el AgentType enum, el cual tiene un name e instructions que se deben mostrar.
  Crear un documento ejs en `src\ChatHTMX\views\*.ejs`.
  Crear un enpoint para renderizarlo en `src\ChatHTMX\ExpressOpenAIAssistantSessionExporter.tsx`.
  Verificar con git diff todos los cambios y realizar un reporte

- [ ] TODO A02 Crear 3 documentos propuesta para refactorizar `src\ChatHTMX\ExpressOpenAIAssistantSessionExporter.tsx`
  - [ ] Subtarea 1: Identificar áreas problemáticas en el código existente y documentarlas en un archivo separado. `src\ChatHTMX\ExpressOpenAIAssistantSessionExporter\problematic_areas.txt`
  - [ ] Subtarea 2: Proponer soluciones y mejoras para cada área problemática identificada.
  - [ ] Subtarea 3: Crear una estructura de carpetas y archivos para la refactorización propuesta.

- [ ] Crear una Tool para leer un documento .doc y .docx, por rango de páginas.
- [ ] Crear una Tool para reescribir un fragmento específico de una página y un párrafo específico de un documento .doc o .docx
- [ ] Crear una Tool para copiar un directorio a un nuevo destino, solo si está vacío el destino, y omitir archivos del .gitignore si está presente en el directorio origen.

## Investigaciones

- [ ] Review this on https://platform.openai.com/docs/actions, using the web_agent
      Multiple authentication schemas
      Actions now support multiple authentication schemas which can be set on a per-endpoint basis. This means you can have some endpoints that require authentication and some that don't.

- [] Implemnetar
  https://github.com/MarketingPipeline/Markdown-Tag
- [] GPT HELPs tools common thinking -> Pointing out the correct usage of