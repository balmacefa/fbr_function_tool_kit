// markdownToJson.ts

export function parseMarkdownToJson<T = any[]>(markdownContent: string): T[] {
    const codeBlockRegex = /```(?:json)?\n?([\s\S]+?)```/g;
    const jsonObjects: T[] = [];

    let match: RegExpExecArray | null;
    while ((match = codeBlockRegex.exec(markdownContent)) !== null) {
        try {
            const json = JSON.parse(match[1]);
            jsonObjects.push(json);
        } catch (error) {
            // If parsing fails, skip this block
        }
    }

    return jsonObjects;
}
