// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
}

// Squelch warnings of image imports from your assets dir
declare module '$assets/*' {
    var meta;
    export default meta;
}
