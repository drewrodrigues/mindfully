# Service Workers

Handle and listen to browser events. They can use Chrome APIs, but cannot interact directly with the contents of a web page. That's the job of _content scripts_.

# Content Scripts

Execute Javascript in the context of a web page. They can read and modify the DOM of the pages they're injected into. They can only use a subset of the Chrome APIs, but can indirectly access the rest by exchanging messages with the _extension service worker_.

# Etc

Extensions can include various HTML files, popups, options page, and more.

# Permissions

- `activeTab` so we can get the tabId to check which rules are matched. Then, we can disable a rule temporarily. To then be re-enabled after viewing a page that matches that rule later.
