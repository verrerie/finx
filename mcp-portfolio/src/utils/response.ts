
type ToolSuccess = Record<string, unknown> & { success?: true };
type ToolError = { success: false; error: string };

export function success(content: ToolSuccess): {
    content: Array<{ type: 'text'; text: string }>;
    isError?: false;
} {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, ...content }, null, 2),
            },
        ],
    };
}

export function error(message: string): {
    content: Array<{ type: 'text'; text: string }>;
    isError: true;
} {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: false, error: message } satisfies ToolError, null, 2),
            },
        ],
        isError: true,
    };
}


