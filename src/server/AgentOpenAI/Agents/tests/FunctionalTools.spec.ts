import { FunctionalTool } from "../../FunctionalTool";



describe('FunctionalTool', () => {

    it('should convert to register correctly', () => {
        const sampleToolFunction = FunctionalTool.sampleDirFlatTreeToolFunction();

        const run_tool = sampleToolFunction.tool_fn(undefined, undefined);

        // Assert the result matches the expected output
        expect(run_tool).toEqual("test_tool");
    });
});
