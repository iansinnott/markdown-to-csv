# Convert A Markdown Blog to CSV

# Why

I wanted to import my blog into Notion and see if I could use that as a blog back end.

# Usage

```
# Clone this repo
# From the root directory of the repo run the following command.
node index.js $PATH_TO_MARKDOWN_DIR
```

Make sure you replace `$PATH_TO_MARKDOWN_DIR` with the correct path on your filesystem. The path should be the directory where your markdown files are, not any one specific file.

If you have files that are not markdown in the same directory it will probably break.
