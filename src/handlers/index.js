const markdownUtils = require('../utils/markdown')

module.exports = async (req, res) => {
  const body = await markdownUtils.readMarkdownAsHTML('README.md')
  return res.status(200).type('text/html').send(body)
}
  