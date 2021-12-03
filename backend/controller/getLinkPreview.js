const linkPreviewGenerator = require("link-preview-generator");
const color = require("colors");

async function getLinkPreview(req, res) {
  const link = req.query.link;
  try {
    const previewData = await linkPreviewGenerator(link);
    res.json(previewData);
  } catch (err) {
    res.staus(400).send("invalid link!");
    console.log(`${err}`.red);
  }
}

module.exports=getLinkPreview;