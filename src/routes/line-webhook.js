const express = require('express');
const line = require('@line/bot-sdk');

const { handleEvent } = require('../line/messageHandler');

const router = express.Router();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

router.post('/:lang', line.middleware(config), (req, res) => {
  const lang = req.params.lang;
  
  Promise
    .all(req.body.events.map(handleEvent(lang)))
    .then((result) => res.json(result));
});

module.exports = router;
