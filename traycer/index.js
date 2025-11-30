// traycer/index.js - minimal plan-only orchestrator
const express = require('express');
const bodyParser = require('body-parser');
const { generateFrontend } = require('../backend/services/ai_connectors/cursor');
const { scaffoldTrips } = require('../backend/services/ai_connectors/antigravity');

const app = express();
app.use(bodyParser.json());

// plan endpoint - doesn't execute, only returns plan
app.post('/plan', (req,res) => {
  const { intent, feature, figmaUrl } = req.body;
  const plan = {
    intent,
    feature,
    steps: [
      { step:1, actor: 'Cursor', action: 'Generate frontend screens from Figma', target: `branch: feat/${feature}` },
      { step:2, actor: 'Antigravity', action: 'Scaffold backend endpoints', target: `branch: feat/${feature}` },
      { step:3, actor: 'Testsprite', action: 'Generate & run tests (CI)', target: 'PR' },
      { step:4, actor: 'CI', action: 'Snyk security scan + deploy to staging', target: 'staging' }
    ],
    estimateUsd: 5,
    risk: 'LOW'
  };
  return res.json({ ok:true, plan });
});

// simple confirm endpoint that runs the two sandbox stubs sequentially
app.post('/confirm-and-run', async (req,res) => {
  const { feature, figmaUrl } = req.body;
  try {
    const cursorResult = await generateFrontend({ figmaUrl, branch: `feat/${feature}` });
    const antigravityResult = await scaffoldTrips({ featureName: feature, branch: `feat/${feature}` });
    return res.json({ ok:true, cursorResult, antigravityResult });
  } catch(err){
    console.error(err);
    return res.status(500).json({ ok:false, error: err.message });
  }
});

const PORT = process.env.TRAYCER_PORT || 4100;
app.listen(PORT, ()=> console.log('Traycer plan service listening on', PORT));
