import { bundledLanguages, createHighlighter, type Highlighter } from 'shiki';
import { transformerMetaHighlight } from '@shikijs/transformers';

const THEME = 'ayu-dark';

// One highlighter for the whole build; languages load on first use.
let highlighter: Promise<Highlighter> | undefined;

async function getHighlighter(language: string) {
    highlighter ??= createHighlighter({ themes: [THEME], langs: [] });
    const instance = await highlighter;
    if (
        language !== 'text' &&
        !instance.getLoadedLanguages().includes(language)
    ) {
        await instance.loadLanguage(language as keyof typeof bundledLanguages);
    }
    return instance;
}

type Block = { _type: string; [key: string]: unknown };
type CodeBlock = Block & {
    code?: string;
    language?: string;
    highlightedLines?: string;
};

/**
 * Highlight every Portable Text `codeBlock` at build time, so posts ship static HTML
 * instead of Shiki and its WebAssembly regex engine. Adds `highlightedHtml` to each code
 * block; unknown languages fall back to plain text.
 */
export async function highlightCodeBlocks<T extends Block>(
    body: T[] | undefined
): Promise<(T & { highlightedHtml: string })[]> {
    return Promise.all(
        (body ?? []).map(async (block) => {
            if (block._type !== 'codeBlock')
                return block as T & { highlightedHtml: string };
            const {
                code = '',
                language,
                highlightedLines,
            } = block as CodeBlock;
            const lang =
                language && language in bundledLanguages ? language : 'text';
            const instance = await getHighlighter(lang);
            const highlightedHtml = instance.codeToHtml(code, {
                lang,
                theme: THEME,
                transformers: [
                    transformerMetaHighlight({ className: 'highlighted' }),
                ],
                meta: highlightedLines
                    ? { __raw: highlightedLines }
                    : undefined,
            });
            return { ...block, highlightedHtml };
        })
    );
}
