<img src="public/landing/logo.png" width="125"> 

# *Notetxt*

A note-taker with a focus on minimalism and simplicity, so you can write down what's on your mind.

## ✨ Features

- Manage multiple notes in the [Note Manager](https://notetxt.xyz/editor?manager=open)
- Support for `.txt` and `.md` files
- Drag/drop or open existing files in the Editor
- Automatically retrieve the last note you were working on
- Download notes to your computer
- View various metrics/information about your notes
- Preview your notes in Markdown
  - Supports a few additional [Remark](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)/[Rehype](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md) plugins, the full list of plugins used can be seen in [this file](src/components/markdown/MarkdownPreview.js)
- **No account required!**

## Keybinds

Use these keybinds to get around faster within the Editor and perform different actions.

| Keybind           | Action              |
|-------------------|---------------------|
| `Ctrl+K`          | **⌘** Command Menu  |
| `Ctrl+O`          | Open Note           |
| `Ctrl+N`          | New Note            |
| `Ctrl+S`          | Save Note           |
| `Ctrl+Shift+C`    | Copy Note           |
| `Ctrl+M`          | Preview Markdown    |
| `Ctrl+I`          | Note Summary        |

## Supported Slash (`/`) Commands

You can use these slash commands to quickly insert different types of Markdown syntax into your notes.

| Command        | Description                                               | Aliases                                    |
|----------------|-----------------------------------------------------------|--------------------------------------------|
| `table`        | Creates a table with two rows and columns.                | `tb`                                       |
| `list`         | Creates a list with dashes.                               | `dashedlist`, `dlist`                      |
| `numberedlist` | Creates a list with numbers.                              | `numlist`, `nlist`                         |
| `bulletList`   | Creates a list with bullet points.                        | `blist`                                    |
| `code`         | Inserts a code block for snippets of code.                |  `snippet`                                 |
| `quote`        | Inserts a blockquote for displaying quotes.               | `blockquote`                               |
| `image`        | Inserts an image with alt text and a placeholder URL.     | `img`, `picture`                           |
| `link`         | Creates a clickable link with text and a placeholder URL. | `url`                                      |
| `tasklist`     | Creates  a template list with checkable tasks.            | `tlist`, `todo`                            |
| `line`         | Inserts a horizontal line to separate content.            | `horizontal`, `hr`, `separator`, `section` |
| `footnote`     | Adds a footnote for adding references to content.         | `fn`, `reference`                          |
| `metadata`     | Adds some sample hidden YAML metadata.                    | `mdata`, `yaml`                            |

## License

©️ **2024** - Notetxt is licensed under the [MIT License](LICENSE).