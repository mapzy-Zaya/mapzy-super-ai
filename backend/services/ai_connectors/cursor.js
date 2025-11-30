// cursor.js - stub connector for Cursor
const fs = require('fs');

async function generateFrontend({ figmaUrl, branch }) {
  const out = {
    message: 'Cursor stub invoked',
    figmaUrl,
    branch,
    filesCreated: [
      `frontend/src/screens/TripCard.stub.js`
    ]
  };

  try {
    fs.mkdirSync('./frontend/src/screens', { recursive: true });
    fs.writeFileSync('./frontend/src/screens/TripCard.stub.js',
      `// TripCard stub created by Cursor at ${new Date().toISOString()}\nconsole.log('TripCard stub');\n`);
  } catch (e) {
    // ignore if running from another cwd
  }

  return out;
}

module.exports = { generateFrontend };