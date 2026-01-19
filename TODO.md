# TODO

## Features And Refactorings

- [x] Add copy to clipboard button to CodeBlock
- [x] Add file icons to CodeBlock based on lang
- [x] Replace `image-transmutation` with https://github.com/zerodevx/svelte-img
    - Important: It only works with import pattern, which complicates blog posts cover, which is
      dynamic, need a solution for this
- [x] Apply `svelte-img` Img to article content
- [ ] Refactor: blog post image organization
    - Requirements:
        - Every post (`src/content/blog`) should also have its own image folder:
            - Cover: $assets/images/posts/{slug}/cover.{extension}
            - Other: $assets/images/posts/{slug}/{uuid}.{extension}
        - Configure frontmatter (vscode extension https://frontmatter.codes/ accordingly), inserting
          images into a post should place the image to the correct post directory with an uuid as
          base file name
- [x] Dynamic social media previews for blog posts
- [x] Add author to frontmatter blog posts display with avatar
- [ ] Custom Callout syntax (see github markdown)
    ```md
    > ![Info] Ipsum
    ```

## Bugs

- [x] Copy Button not correctly aligned when no file name provided
- [x] Footer should be at bottom, even if main content is not full height (see 404 page)
- [x] Largest Contentful Paint of pages, optimize layout shifts, for example /blog and articles
- [x] Fix alias $assets not working for article images
- [x] Fix content in rss.xml
- [x] Reading Time not on blog post view
- [ ] Bubbles are starting moving all up: Init movement vector randomly or based on pixel position
