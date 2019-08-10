const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());

/**
 * Use ytdl(https://github.com/fent/node-ytdl-core)
 * to download a youtube video.
 */
app.get('/download', (req, res) => {
  console.log('/download', req.query);
  const url = req.query.url;
  if (!url) res.send('need youtube video url.');

  const name = req.query.name || 'video';
  res.header(
    'Content-Disposition',
    `attachment; filename="${name}.mp4"`
  );

  ytdl(url, { format: 'mp4' }).pipe(res);
});

const server = app.listen(3000, () => {
  console.log("Expressjs port:", server.address().port);
});
