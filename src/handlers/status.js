module.exports = (req, res) => {
  res.status(200).json({
    status: 'OK',
    description: 'Lock and load!'
  })
}