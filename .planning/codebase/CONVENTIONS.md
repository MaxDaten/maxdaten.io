# Coding Conventions

**Analysis Date:** 2026-01-18

## Naming Patterns

**Files:**

- Svelte components: PascalCase (`CodeBlock.svelte`, `BlogPostCard.svelte`)
- Component tests: `ComponentName.svelte.test.ts` for browser tests
- TypeScript modules: kebab-case (`file-icons.ts`, `image-loader.ts`)
- Unit tests: `modulename.test.ts` co-located with source
- Server-only modules: Located in `src/lib/server/`
- Storybook stories: `ComponentName.stories.svelte`

**Functions:**

- camelCase for all functions (`readingTime`, `filterPosts`, `getFileIcon`)
- Prefix getters with `get` (`getAuthor`, `getRelatedPosts`, `getCoverBySlug`)
- Async functions use verb + noun pattern (`importPosts`, `importPostBySlug`)

**Variables:**

- camelCase for variables and parameters (`currentTheme`, `codeBlockElement`)
- SCREAMING_SNAKE_CASE for constants (`LANGUAGE_ICON_MAP`, `CONTENT_DIR`)
- Prefix boolean state with descriptive verbs (`showLineNumbers`, `showBackground`)

**Types:**

- PascalCase for types and interfaces (`BlogPost`, `Author`, `GemEntry`)
- Suffix type aliases with `Type` when clarifying (`SparkleType`, `TagType`)
- Interface for component props: `Props` (local naming convention)

## Code Style

**Formatting:**

- Tool: Prettier with `prettier-plugin-svelte`
- Tab width: 4 spaces
- Single quotes
- Trailing comma: ES5 style
- Prose wrap: Always

**Linting:**

- Tool: ESLint 9 with flat config
- TypeScript-ESLint recommended ruleset
- Svelte plugin for `.svelte` files
- Storybook plugin for stories
- Unused variables must be prefixed with `_` (e.g., `_path`)
- JavaScript files (`.js`) are ignored by lint

## Import Organization

**Order:**

1. Framework imports (`svelte`, `@sveltejs/kit`)
2. External packages (alphabetical)
3. Internal aliases in order: `$lib`, `$components`, `$utils`, `$stores`, `$routes`, `$assets`
4. Relative imports (last)

**Path Aliases:**

- `$components` -> `./src/lib/components`
- `$lib` -> `./src/lib`
- `$stores` -> `./src/lib/stores`
- `$styles` -> `./src/lib/scss`
- `$utils` -> `./src/lib/utils`
- `$routes` -> `./src/routes`
- `$assets` -> `./src/lib/assets`

**Example:**

```typescript
import type { BlogPost } from '$utils/types';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import striptags from 'striptags';
import { filterPosts, postLoaders, readingTime } from '$lib/data/posts';
```

## Svelte 5 Patterns

**Props Declaration:**

```svelte
<script lang="ts">
    interface Props {
        filename: string | null;
        showLineNumbers: boolean;
        lang: string | null;
        fullBleed?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        filename = null,
        showLineNumbers = true,
        lang = null,
        fullBleed = false,
        children,
    }: Props = $props();
</script>
```

**State Management:**

- Use `$state()` for local reactive state
- Use `$derived` or `$derived.by()` for computed values
- Use Svelte stores (`writable`) for global state (`src/lib/stores/theme.ts`)

**Snippets:**

```svelte
{#snippet icon()}
    {#if copyButtonState === 'idle'}
        <CopyIcon width="20px" height="20px" />
    {/if}
{/snippet}
```

**Render Children:**

```svelte
{@render children?.()}
```

## Error Handling

**Patterns:**

- Use SvelteKit's `error()` function for route errors
- Use try/catch with console.error for client-side async operations
- Provide user feedback via state (e.g., `copyButtonState: 'failure'`)

**Example:**

```typescript
export async function importPostBySlug(slug: string): Promise<BlogPost> {
    const loadPost = loaderBySlug.get(slug) ?? error(404, 'Post not found');
    return await toBlogPost(loadPost);
}
```

**Client-side async:**

```typescript
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(codeText);
        copyButtonState = 'success';
    } catch (error) {
        console.error('Failed to copy code:', error);
        copyButtonState = 'failure';
    } finally {
        setTimeout(() => {
            copyButtonState = 'idle';
        }, 2000);
    }
}
```

## Logging

**Framework:** `console` (no logging framework)

**Patterns:**

- `console.error()` for caught exceptions
- `console.log()` for debug output in tests
- `console.warn()` for non-fatal issues

## Comments

**When to Comment:**

- JSDoc for exported utility functions
- Inline comments for non-obvious logic
- TODO comments for known improvements needed

**JSDoc Pattern:**

```typescript
/**
 * Get the SVG icon content for a given programming language
 * @param lang - The programming language identifier
 * @returns SVG content as string or null if no icon found
 */
export function getFileIcon(lang: string | null): string | null {
    if (!lang) return null;
    const normalizedLang = lang.toLowerCase().trim();
    return LANGUAGE_ICON_MAP[normalizedLang] || null;
}
```

## Function Design

**Size:** Keep functions focused and small (< 30 lines preferred)

**Parameters:**

- Use object destructuring for 3+ parameters
- Provide sensible defaults for optional parameters
- Use null (not undefined) for explicitly absent values

**Return Values:**

- Return early for edge cases
- Use explicit return types on exported functions
- Prefer returning objects for multiple values

## Module Design

**Exports:**

- Named exports preferred over default exports
- Group related functions in single files
- Types exported from dedicated `types.ts` files

**Barrel Files:**

- Not used extensively
- Data modules have index files (`src/lib/data/gems/index.ts`)

## Styling Conventions

**Component Styles:**

- Use `<style lang="scss">` for scoped SCSS
- CSS custom properties (variables) for theming
- BEM-like class naming within components

**SCSS Patterns:**

```scss
@use '$lib/scss/breakpoints.scss';

.code-block {
    figure {
        margin: 1.5em 0;

        &:hover :global(.copy-button) {
            opacity: 0.4;
        }
    }
}
```

**Global Selectors:**

- Use `:global()` sparingly for child component styling
- Breakpoint mixins via `@include breakpoints.for-phone-only`

## Type Patterns

**Type Definitions:**

```typescript
export type BlogPost = {
    tags: string[];
    keywords: string[];
    hidden: boolean;
    slug: string;
    title: string;
    date: string;
    updated: string;
    excerpt: string;
    readingTimeMinutes: number | undefined;
    relatedPosts: BlogPost[];
    content: Component;
    authorId?: string;
};
```

**Type Assertions:**

- Use `satisfies` for type checking without widening
- Prefer explicit typing over assertion

**Example:**

```typescript
const pageMetaTags = Object.freeze({
    title: 'Blog',
    description: '...',
}) satisfies MetaTagsProps;
```

---

_Convention analysis: 2026-01-18_
