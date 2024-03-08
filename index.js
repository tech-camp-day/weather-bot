const express = require("express");
const bodyParser = require("body-parser");
const lineWebhook = require("./routes/line-webhook");

const app = express();

const port = 3000;

app.use("/webhook/line", lineWebhook);
app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
