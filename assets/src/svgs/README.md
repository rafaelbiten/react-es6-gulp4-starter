### SVGs

A single SVG sprite containing all SVGs on this folder will be created and injected on the `index` file, right after the opening `<body>` tag.
The result is a single **inline SVG**, so no new file or folder is created on the `dist/` folder.

**Usage example:** for a file called `apple.svg` saved inside on this folder, use something like `<svg class="svg--apple"><use xlink:href="#apple"></use></svg>`.
