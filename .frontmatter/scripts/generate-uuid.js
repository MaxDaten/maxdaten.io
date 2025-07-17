const { PlaceholderScript } = require("@frontmatter/extensibility");
const { v4: uuidv4 } = require('uuid');

(async () => {
  PlaceholderScript.done(uuidv4());
})();