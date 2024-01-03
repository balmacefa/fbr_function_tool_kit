import { InjectTsVariableToEjs } from "./inject_ts_varaible_to_ejs";

describe('InjectTsVariableToEjs', () => {
    let injector: InjectTsVariableToEjs;

    beforeEach(() => {
        injector = new InjectTsVariableToEjs();
    });

    describe('extractFunctionNames', () => {
        test('debe extraer nombres de funciones correctamente', () => {
            const exampleCode = `
                function exampleFunction() {}
                function anotherFunction() {}
            `;
            const expected: string[] = ['exampleFunction', 'anotherFunction'];
            const extractedNames: string[] = injector.extractFunctionNames(exampleCode);
            expect(extractedNames).toEqual(expected);
        });

        test('debe retornar un arreglo vacío si no hay funciones', () => {
            const exampleCode = `const a = 5;`;
            const expected: string[] = [];
            const extractedNames: string[] = injector.extractFunctionNames(exampleCode);
            expect(extractedNames).toEqual(expected);
        });
    });

    describe('generateCodeStructure', () => {
        test('debe generar la estructura de código correctamente', () => {
            const functionNames: string[] = ['fn1', 'fn2'];
            const generatedCode: string = injector.generateCodeStructure(functionNames);

            expect(generatedCode).toMatch(/fn_name_fn1/);
            expect(generatedCode).toMatch(/fn_name_fn2/);
        });

        test('debe manejar un arreglo vacío correctamente', () => {
            const functionNames: string[] = [];
            const generatedCode: string = injector.generateCodeStructure(functionNames);
            expect(generatedCode).toBe('');
        });
    });
});
