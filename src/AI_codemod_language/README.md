# AI-to-AI Query Language Tool

## Introduction

This tool provides a query language designed for AI-to-AI communication in software development, enabling precise and efficient code manipulation and analysis. It uses a structured syntax to query and modify various code elements in a project.

### Purpose and Scope

The tool is designed to facilitate AI-to-AI communication in software development, particularly focusing on code manipulation and analysis through a structured query language.

### Features

It includes detailed query language, precise code manipulation capabilities, and supports various actions such as Query, Modify, Add, Delete, Search, DeepFetch, and batchModify.

### Usage and Syntax

The query language uses full file paths, abbreviations, and special symbols for efficient querying. Actions like Query, Modify, Add, etc., are defined with specific syntax and examples.

#### Technical Stack

The project integrates technologies such as TypeScript, Express with EJS, Swagger UI, GPT Toolset for OpenAI Assistants API, Langchain, and HTMX for Chat UI and CMS rendering.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Basic Examples](#basic-examples)
  - [Advanced Usage](#advanced-usage)
- [Query Language Syntax](#query-language-syntax)
  - [File Paths](#file-paths)
  - [Abbreviations and Symbols](#abbreviations-and-symbols)
  - [Actions and Patterns](#actions-and-patterns)
- [Contributing](#contributing)
  - [How to Contribute](#how-to-contribute)
  - [Code of Conduct](#code-of-conduct)
  - [Pull Request Process](#pull-request-process)
- [Error Handling and Debugging](#error-handling-and-debugging)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact Information](#contact-information)

## Features

- Detailed query language for AI-to-AI interactions.
- Precise code manipulation capabilities.
- Support for multiple actions like Query, Modify, Add, Delete, and Search.
- Special syntax for file paths, abbreviations, and symbols.
- feature personal @balmacefa/fbr_function_tool_kit npm package; Fork workflow. pnpm workspace.
  - Typescript with ejs Express.
  - Swagger UI autogerated
  - GPT Toolset for OpenAI Assistants API and ChatGPT Assistants OpenAPI .json, Langchain
  - HTMX Chat UI
  - HTMX CMS Renderer

## Getting Started

### Prerequisites

- Knowledge of software development and code structures.
- Basic understanding of query languages.

### Installation

- Currently, this tool is in the conceptual stage. Installation details will be provided in future versions.

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

  - `fl`: Represents the entire file.
  - `fn`: Represents a function.
  - `cls`: Denotes a class.
  - `prop`: Indicates a property.
  - `mth`: Stands for a method.
  - `lcd`: line of code - Designates a specific line number.
  - `lcr`: line of code - Range of line.

- **Special Symbols**:

  - `*`: Represents a wildcard for broader search queries.

- **Usage Examples**:
  - Function in a file: `src/utils/logger.ts.fn:log`.
  - Method in a class: `src/models/User.ts.cls:User.mth:validateUser`.
  - Property in a class: `src/config/Database.ts.cls:DatabaseConfig#dbString`.

### Actions and Patterns

The language supports various actions for code manipulation and information retrieval.

- **batchModify**: `batchModify:<type, sequence|pipe>: <ops >`

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

---

## Examples

Our project is designed to be both powerful and user-friendly. To help you get started, we've provided a series of detailed examples. These examples are intended to demonstrate the project's capabilities and cover various functionalities. Whether you're a beginner or an advanced user, these examples will guide you through the core features and advanced functionalities of our tool.

### Basic Examples

1. **Hello World Example**

   - **Description**: A simple demonstration of setting up and running a basic "Hello World" script.
   - **Code**:
     ```typescript
     import { greet } from "our-project";
     console.log(greet("World"));
     ```
   - **Expected Output**:
     ```
     Hello, World!
     ```

2. **Basic Query Usage**
   - **Description**: Illustrates how to use the basic query feature to retrieve data.
   - **Code**:
     ```typescript
     import { query } from "our-project";
     const result = query("path/to/file.ts@ClassName#propertyName");
     console.log(result);
     ```
   - **Expected Output**:
     ```
     Value of propertyName in ClassName
     ```

### Intermediate Examples

1. **Data Manipulation**

   - **Description**: Shows how to modify data using our tool's manipulation functions.
   - **Code**:
     ```typescript
     import { modify } from "our-project";
     modify("path/to/file.ts@ClassName#propertyName", "newValue");
     ```
   - **Expected Behavior**: This script will change the value of `propertyName` in `ClassName` within `file.ts` to `newValue`.

2. **Batch Operations**
   - **Description**: Demonstrates performing batch operations on multiple files.
   - **Code**:
     ```typescript
     import { batchModify } from "our-project";
     batchModify([
       { path: "src/file1.ts", changes: [...changes1] },
       { path: "src/file2.ts", changes: [...changes2] },
     ]);
     ```
   - **Expected Behavior**: This script will apply the specified changes to `file1.ts` and `file2.ts`.

### Advanced Examples

1. **Complex Query with Wildcards**

   - **Description**: Utilizes advanced querying with wildcards to search across multiple files.
   - **Code**:
     ```typescript
     import { search } from "our-project";
     const results = search("src/**/*.ts.fn:complexFunction");
     console.log(results);
     ```
   - **Expected Output**:
     ```
     List of all occurrences of 'complexFunction' in TypeScript files under the src directory.
     ```

2. **Custom Script Integration**
   - **Description**: Shows how to integrate a custom script for specialized tasks.
   - **Code**:
     ```typescript
     import { customTask } from "our-project";
     customTask("path/to/customScript.ts", { option1: true, option2: "value" });
     ```
   - **Expected Behavior**: Executes `customScript.ts` with the specified options.

Each example is designed to provide practical insight into how our tool can be used in real-world scenarios. For more detailed information and additional examples, please refer to our [online documentation](#).

---

API Reference
Link to the API documentation or include a basic API reference.

Examples
Include more comprehensive examples demonstrating the project's capabilities.

Contributing
Guidelines for how to contribute to the project:

How to submit bugs
How to request features
How to submit pull requests
Code of Conduct
Link to the Code of Conduct, or include it directly in the README.
