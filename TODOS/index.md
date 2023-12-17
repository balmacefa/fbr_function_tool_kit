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

- [ ] Ver contenido del documento `src\ChatHTMX\views\Readme.md`, y Crear el siguiente feature: Crear una endpoint para htmx que lista los posible Agents, del archivo `src\ChatHTMX\AssistantsFactory.ts`, debes hacer loops over the AgentType enum estos tienen un name, e instructions que se deben mostar.
      crear un documento ejs en -> `src\ChatHTMX\views\*.ejs` y envestigar como crear un enpoint para ver los agents

- [ ] Crear una Tool para leer un documento .doc y .docx, por rango de p�ginas.
- [ ] Crear una Tool para reescribir un fragmento espec�fico de una p�gina y un p�rrafo espec�fico de un documento .doc o .docx
- [ ] Crear una Tool para copiar un directorio a un nuevo destino, solo si est� vac�o el destino, y omitir archivos del .gitignore si est� presente en el directorio origen.

## Investigaciones

- [ ] Review this on https://platform.openai.com/docs/actions, using the web_agent
      Multiple authentication schemas
      Actions now support multiple authentication schemas which can be set on a per-endpoint basis. This means you can have some endpoints that require authentication and some that don't.
