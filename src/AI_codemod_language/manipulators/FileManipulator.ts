// src/manipulators/FileManipulator.ts

export abstract class FileManipulator {
    protected filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    abstract queryFunction(functionName: string): string;
    abstract queryClass(className: string): string;
    abstract queryProperty(propertyName: string): string;
    abstract queryMethod(methodName: string): string;
    // Add more abstract methods as needed
}
