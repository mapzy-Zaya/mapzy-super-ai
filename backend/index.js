// backend/index.js - minimal BFF for AI connectors & webhooks
const express = require('express');
const bodyParser = require('body-parser');
const { scaffoldTrips } = require('./services/ai_connectors/antigravity');
const { generateFrontend } = require('./services/ai_connectors/cursor');

const app = express();
app.use(bodyParser.json());

app.get('/health', (req,res) => res.json({ok:true, time:Date.now()}));

// simple endpoint to test Cursor generate (sandbox branch only)
app.post('/ops/generate-ui', async (req,res) => {
  try {
    const { figmaUrl, branch = 'sandbox/ui' } = req.body;
    const result = await generateFrontend({ figmaUrl, branch });
    return res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// simple endpoint to test Antigravity scaffold (sandbox only)
app.post('/ops/scaffold-backend', async (req,res) => {
  try {
    const { featureName, branch = 'sandbox/feature' } = req.body;
    const result = await scaffoldTrips({ featureName, branch });
    return res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('BFF listening on', PORT));
