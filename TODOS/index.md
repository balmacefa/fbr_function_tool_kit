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

## Generar un Agente Nuevo

# TODOs Categorizados

## Herramientas a Crear

- Todo: crear un protocolo para, indicar que se debe sugerir realizar un git branch check out antes de modificar o crear un documento.
- [ ] Ver contenido del documento `src\ChatHTMX\views\Readme.md`, y arregar el siguiente bug:

  - [] En el input area del chat, no se hace mas alto, cuando el contenido del texto es amplio.
  - [] Cambiar class , para adaptar la altura del texto, colocar una altura maxima. - [] Cuando se envia el form, el input area debe cambiar por un loader.
    -[] Ver el diff de git, y verificar que los cambios son correcto.
    -[] hacer un commit de los cambios.

- [ ] Ver contenido del documento `src\ChatHTMX\views\Readme.md`, y Crear el siguiente feature: Crear una endpoint para htmx que lista los posible Agents, del archivo `src\ChatHTMX\AssistantsFactory.ts`, debes hacer loops over the AgentType enum estos tienen un name, e instructions que se deben mostar.
      crear un documento ejs en -> `src\ChatHTMX\views\*.ejs` y envestigar como crear un enpoint para ver los agents

- [ ] Crear una Tool para leer un documento .doc y .docx, por rango de páginas.
- [ ] Crear una Tool para reescribir un fragmento específico de una página y un párrafo específico de un documento .doc o .docx
- [ ] Crear una Tool para copiar un directorio a un nuevo destino, solo si está vacío el destino, y omitir archivos del .gitignore si está presente en el directorio origen.

## Investigaciones

- [ ] Review this on https://platform.openai.com/docs/actions, using the web_agent
      Multiple authentication schemas
      Actions now support multiple authentication schemas which can be set on a per-endpoint basis. This means you can have some endpoints that require authentication and some that don't.
