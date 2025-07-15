// Inspired: https://github.com/nikolailehbrink/portfolio/blob/main/app/lib/shiki/transformerCodeBlock.ts
/**
 * @typedef {import('shiki').ShikiTransformer} ShikiTransformer
 */

/**
 * A Shiki transformer that processes metadata for code blocks including:
 * - Filename display
 * - Copy button visibility
 * - Line numbers display
 *
 * Usage examples:
 * ````
 * ```js filename="example.js"
 * console.log('Hello world')
 * ```
 * ````
 *
 * ````
 * ```js showLineNumbers
 * console.log('Hello world')
 * ```
 * ````
 * @returns {ShikiTransformer}
 */
export function transformerCodeBlock() {
    return {
        name: 'transformer-code-block',
        /**
         * @this {import('shiki').ShikiTransformerContextCommon}
         */
        preprocess() {
            if (!this.options.meta?.__raw) {
                return;
            }

            const rawMeta = this.options.meta?.__raw ?? '';
            const filenameMatch = rawMeta.match(/filename="([^"]+)"/);

            // Update options.meta with all collected metadata
            // Key values in options.meta will be serialized to the attributes of the root <pre> element
            this.options.meta = {
                ...this.options.meta,
                'data-language': this.options.lang,
                ...(filenameMatch?.[1] && {
                    'data-filename': filenameMatch[1],
                }),
            };
        },
        /**
         * @this {import('shiki').ShikiTransformerContext}
         * @param {import('hast').Element} hast
         */
        pre(hast) {
            // Handle line numbers display, has to be done in the pre step,
            // because preprocess only returns the code and not the hast
            const showLineNumbers =
                this.options.meta?.__raw?.includes('showLineNumbers');

            if (!showLineNumbers) {
                return;
            }
            this.addClassToHast(hast, 'show-line-numbers');
            const startingNumberMatch = this.options.meta?.__raw?.match(
                /showLineNumbers=(\d+)/
            );
            const startingNumber =
                startingNumberMatch && parseInt(startingNumberMatch[1], 10);

            if (startingNumber) {
                hast.properties.style = `--starting-line-number: ${startingNumber};`;
            }
        },
    };
}
