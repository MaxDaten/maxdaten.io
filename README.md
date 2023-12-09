# maxdaten.io

This is the source code for my personal website, [maxdaten.io](https://maxdaten.io). Driven by the f*** awesome [sveltekit-static-blog-template](https://github.com/matfantinel/sveltekit-static-blog-template).
It's built with [SvelteKit](https://kit.svelte.dev), and uses [MDsveX](https://mdsvex.pngwn.io/) to allow using Svelte components inside Markdown files.

## Building & Running Locally

To run it locally, you simply have to run:

```shell
# First, install dependencies
npm install
# Then, run it on dev mode
npm run dev
```

The site should now be available at http://localhost:5173/ on your local machine, and your local machine's IP address on your network—great for testing on mobile OSes.

## Histoire / Storybook

I've used [Histoire](https://histoire.dev), a Vite-based Storybook alternative to be able to see and develop components in isolation. To open it, run `npm run story:dev`.

## Image Optimization

This website uses [image-transmutation](https://github.com/matfantinel/image-transmutation) to automatically optimize images used in the site. This means that even if you use non-optimal image formats (like lossless PNGs), it will go over the images and convert images to WebP and AVIF for you, as long as you use the `<Image />` component instead of `<img />`. This is done on build, so it doesn't change anything when running the website locally.

## Managing Posts

All posts are Markdown files that are processed with [MDsveX](https://mdsvex.pngwn.io/) to allow using Svelte components inside them. In order to make it easier to manage posts, I highly recommend the [Front Matter VS Code extension](https://frontmatter.codes/), which gives you a nice CMS-like UI.
