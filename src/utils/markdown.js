const fs = require('fs')
const markdown = require('markdown').markdown

const readMarkdownAsHTML = (filename) => {
  const fileContent = fs.readFileSync(filename, 'utf8')
  return markdown.toHTML(fileContent)
}

module.exports = {
  readMarkdownAsHTML
}