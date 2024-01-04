# AI-to-AI Query Language Tool

## Introduction

This tool provides a query language designed for AI-to-AI communication in software development, enabling precise and efficient code manipulation and analysis. It uses a structured syntax to query and modify various code elements in a project.

## Usage

### Basic Examples

- Query a function: `Query: src/utils/logger.ts.fn:log`.

### Advanced Usage

- Modify a property: `Modify: src/models/User.ts@User#email -> [new property definition]`.

## Query Language Syntax

### File Paths

- Uses full file paths for precise identification.
- Example: `src/models/User.ts`.

### Abbreviations and Symbols

- `fn`, `

---

## Query Language Syntax

### File Paths

The query language uses full file paths to precisely identify code elements. This approach ensures accuracy, especially in large projects with multiple files of the same name.

- **Format and Structure**: The file path should include the relative path from the project root, the filename, and its extension.

  - Example: `src/models/User.ts`.

- **Examples**:
  - Querying a class method: `src/controllers/UserController.ts@class@getUser`.
  - Referencing a specific line: `src/utils/helpers.ts:42`.
  - Modifying a range of lines: `src/config/settings.ts:10->20`.

### Abbreviations and Symbols

The language incorporates abbreviations and special symbols to streamline queries.

- **Abbreviations**:

  - `fn`: Represents a function.
  - `cls`: Denotes a class.
  - `prop`: Indicates a property.
  - `mth`: Stands for a method.

- **Special Symbols**:

  - `@`: Used for specifying methods.
  - `#`: Used for specifying properties.
  - `:`: Designates a specific line number.
  - `->`: Indicates a range of lines.
  - `*`: Represents a wildcard for broader search queries.

- **Usage Examples**:
  - Function in a file: `src/utils/logger.ts.fn:log`.
  - Method in a class: `src/models/User.ts.cls:User.mth:validateUser`.
  - Property in a class: `src/config/Database.ts.cls:DatabaseConfig#dbString`.

### Actions and Patterns

The language supports various actions for code manipulation and information retrieval.

- **Query**: Retrieves information about code elements.

  - **Syntax**: `Query: <file path>@<class>@<member>`
  - **Example**: `Query: src/controllers/UserController.ts@UserController@getUserById`.

- **Modify**: Changes existing code elements.

  - **Syntax**: `Modify: <file path>@<class>@<member> -> [new content]`
  - **Example**: `Modify: src/models/User.ts@User#email -> [new property definition]`.

- **Add**: Adds new code elements.

  - **Syntax**: `Add: <file path>.<element> -> [element definition]`
  - **Example**: `Add: src/utils/newHelper.ts.fn:helperFunction -> [function definition]`.

- **Delete**: Removes existing code elements.

  - **Syntax**: `Delete: <file path>@<class>@<member>`
  - **Example**: `Delete: src/models/OldModel.ts@class@deprecatedMethod`.

- **Search**: Finds usage or references across files.

  - **Syntax**: `Search: <pattern>`
  - **Example**: `Search: src/**/*.ts.fn:unusedFunction`.

- **DeepFetch**:

  - **Purpose**: Retrieve deep, contextual code snippets from multiple files.
  - **Syntax**: `DeepFetch: <file path>@<class>@<member>`.
  - **Example**: `DeepFetch: src/controllers/UserController.ts@UserController@getUserById`.
  - **Output**: Includes the main method/function and snippets of any referenced classes or functions across the codebase for complete context.

- **Common Patterns**:
  - Method in a Class: `Path@class@methodName`.
    - `src/controllers/UserController.ts@UserController@createUser`.
  - Property in a Class: `Path@class#propertyName`.
    - `src/config/DatabaseConfig.ts@DatabaseConfig#connectionString`.
  - Function in a File: `Path.fn:functionName`.
    - `src/utils/logger.ts.fn:log`.
  - Specific Line in a File: `Path:lineNumber`.
    - `src/server/server.ts:42`.
  - Range of Lines in a File: `Path:lineStart->lineEnd`.
    - `src/server/server.ts:15->30`.

### Special Symbols for Output Modification

- **Exclude Comments (`^`)**: Appends `^` to a query to exclude comments from the output.

  - Example: `Query: src/utils/logger.ts.fn:log^`.

- **Include Line Numbers (`L##`)**: Appends `L##` to include line numbers in the output.

  - Example: `Query: src/models/User.ts.cls:User.L##`.

- **Combining Modifiers**: Combine `^` and `L##` for custom output formatting.
  - Example: `Query: src/config/Database.ts.cls:DatabaseConfig#dbString^L##`.

### Action: DeepFetch

- **Purpose**: Retrieve deep, contextual code snippets from multiple files.
- **Syntax**: `DeepFetch: <file path>@<class>@<member>`.
- **Example**: `DeepFetch: src/controllers/UserController.ts@UserController@getUserById`.
- **Output**: Includes the main method/function and snippets of any referenced classes or functions across the codebase for complete context.
