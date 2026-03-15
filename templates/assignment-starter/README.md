# Assignment Starter Folder

Copy this full folder when creating a new assignment.

## Shared Nav + Header Integration

quick notes on what to update for each new assignment

## Quick Start

1. Copy templates/assignment-starter
2. Update page title and main content.
3. Set the correct paths

## Add New Assignment To Shared Nav

To add a new item in the Assignments dropdown, update these:

1. partials/site-header-nav.html
- Add the visible nav link in the dropdown menu.

2. js/load-shared-nav.js navTemplate
- Add the same link in the embedded navTemplate string to help things load locally

3. js/load-shared-nav.js hrefMap
- Add a key-value path in hrefMap inside applyLocalFileHrefs helps local again

4. Current page highlighting
- On assignment page, set data-current-page to the nav key
