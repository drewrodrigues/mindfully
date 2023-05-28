# Setup

1. `npm install`
2. `npm watch` to rebuild Javascript/Typescript into dist directory
3. Load unpacked extension in `chrome://extensions`
4. When some files change, you may need to do a manual reload in the chrome extensions UI

# Permissions

- `activeTab` so we can get the tabId to check which rules are matched. Then, we can disable a rule temporarily. To then be re-enabled after viewing a page that matches that rule later.
