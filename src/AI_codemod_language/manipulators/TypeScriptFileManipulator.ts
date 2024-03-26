// // src/manipulators/TypeScriptFileManipulator.ts

// import { Project } from "ts-morph";
// import { FileManipulator, QueryParts } from "./FileManipulator";

// export class TypeScriptFileManipulator extends FileManipulator {
//     project: Project;

//     constructor(filePath: string) {
//         super(filePath);
//         this.project = new Project();
//         this.project.addSourceFileAtPath(filePath);
//     }

//     executeQueryAction(queryParts: QueryParts): string {
//         const [filePath, classOrProperty] = queryParts.raw_queryParts[0].split("@");
//         const sourceFile = this.project.getSourceFile(filePath);
//         if (!sourceFile) {
//             return "File not found";
//         }

//         if (classOrProperty.includes("#")) {
//             const [className, propertyName] = classOrProperty.split("#");
//             const cls = sourceFile.getClass(className);
//             if (!cls) {
//                 return "Class not found";
//             }
//             const prop = cls.getProperty(propertyName);
//             return prop ? prop.getText() : "Property not found";
//         } else if (classOrProperty.includes(".")) {
//             // Implement querying a function here
//             return "Function not found";
//         } else {
//             // Implement querying a class here
//             return "Class not found";
//         }
//     }

//     executeModifyAction(queryParts: QueryParts): string {
//         // Implement modification logic here
//         return "Modification not implemented";
//     }

//     executeAddAction(queryParts: QueryParts): string {
//         // Implement addition logic here
//         return "Addition not implemented";
//     }

//     executeDeleteAction(queryParts: QueryParts): string {
//         // Implement deletion logic here
//         return "Deletion not implemented";
//     }

//     executeSearchAction(queryParts: QueryParts): string {
//         // Implement search logic here
//         return "Search not implemented";
//     }

//     executeDeepFetchAction(queryParts: QueryParts): string {
//         // Implement deep fetch logic here
//         return "Deep fetch not implemented";
//     }
// }
