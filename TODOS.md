# This file is maintained by ChatGPT model and Humans - DO NOT CHANGE THESE LINES

Reglas del archivo, por favor realice una tarea y subtarea a la vez,
si una tarea es muy compleja, pruebe primero a dividirla en subtareas,
coloque [] para indicar si la tarea ya se cumplió

# Commons actions list

Utiliza esta lista como una guia o pase para la toma de acciones o deciciones.

- Crear una nueva tool: (descripcion de la tool) ->
  1, Analizar la estructura del directorio raíz, con una profundidad de 12,
  2, Revisar y analizar archivos `.tool.ts`
  3, Crear la nueva tool
  4, Guardar el archivo new_tool_name.ts

- objetivos, prompt del user etc (descripcion del tipo de archivo):Investigar archivos que podrian ayudar,->
  1, Analizar la estructura del directorio raíz, con una profundidad de 12,
  2, Si no existe un archivo de mapa de directorio, debes asumir cuales archivos podrian satifazer
  la busqueda.
  3, Si existe debes ver el contenido de dicho archivo e enterpretar cualaes archivos favorecen complir con el objetivo.
  4, Ver el contenido de todos los archivos.

# TODOs

- [] src\scrape_web_ai_vision\web_agent.js -> Convertir a .tool.ts, y guardar archivo, sin omitir contenido!!

  - 1 - Revisar y entender el código de `web_agent.js`
  - 2- Crear una nueva tool: para `web_agent.ts`

- [] Crear una Tool para ver el contenido de multiples archivos a la vez, input array of paths, out put list out path and content json array. Investigar archivos para crear esta TOOL!!

- [] Crear una Tool para leer un documento .doc y .docx, por rango de paginas.
- [] Crear una Tool para rescribir un fragmento escpifico de una pagina y un parrafo especifico de un documento .doc o .docx

- [] Crear una Tool para
- [] Crear una Tool para copiar un directorio a un nuevo destino, solo si esta vacio el destino, y omitir archivos del .gitignore si esta presente en el directorio origen.
- [] Crear un Tool para crear un .zip.
- [] Crear un Tool para ejecutar comandos de pnpm en el directorio.
- [] Crear un Tool para ejecutar codigo .ts desde execa, investigar archivos que podrian ayudar.
- [] Crear una Tool para borrar archivos.

- [] Review this on https://platform.openai.com/docs/actions, using the web_agent
  Multiple authentication schemas
  Actions now support multiple authentication schemas which can be set on a per-endpoint basis. This means you can have some endpoints that require authentication and some that don't.

This can be set as a components -> securityschemes -> object in the OpenAPI spec, and on each operation in the spec there will be a security object. If no security object is specified in the operation, we consider it unauthed or noauth.

- [] Crear un Tool para investigar por Github webpages, Crear un documento con un mapa visual de los elementos, y selectores css de dichos elementos, ya sea un id o un array de posibles class, o una combinacion de ambos
