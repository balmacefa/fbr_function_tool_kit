import { parseMarkdownToJson } from "./JSON_MD_Parser";

// markdownToJson.test.ts
describe('parseMarkdownToJson', () => {
    it('should extract JSON from a single code block', () => {
        const markdown = "```\n{\"foo\":\"bar\"}\n```";
        expect(parseMarkdownToJson(markdown)).toEqual([{ foo: 'bar' }]);
    });

    it('should extract JSON from a code block with json identifier', () => {
        const markdown = "```json\n{\"foo\":\"bar\"}\n```";
        expect(parseMarkdownToJson(markdown)).toEqual([{ foo: 'bar' }]);
    });

    it('should ignore non-JSON code blocks', () => {
        const markdown = "```\nsome non-json text\n```";
        expect(parseMarkdownToJson(markdown)).toEqual([]);
    });

    it('should handle multiple JSON code blocks', () => {
        const markdown = "```\n{\"foo\":\"bar\"}\n```\n```json\n{\"baz\":\"qux\"}\n```";
        expect(parseMarkdownToJson(markdown)).toEqual([{ foo: 'bar' }, { baz: 'qux' }]);
    });

    it('should handle empty code blocks', () => {
        const markdown = "```\n\n```";
        expect(parseMarkdownToJson(markdown)).toEqual([]);
    });
});
