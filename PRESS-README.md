# Press Links Management

This document explains how to manage the press links section of your website.

## Overview

The press links are stored in a separate data file (`press-data.js`), making them easy to maintain without modifying the main HTML structure. The JavaScript code automatically loads and displays these links when the page loads.

## How to Add, Edit, or Remove Press Links

1. Open the `press-data.js` file in any text editor
2. Modify the `pressItems` array as needed:

```javascript
const pressItems = [
    {
        title: "PUBLICATION NAME",
        url: "https://example.com/article-link",
        date: "YYYY-MM-DD",  // Optional
        description: "Short description of article"  // Optional
    },
    // Add more items here...
];
```

### Adding a New Press Link

To add a new press link, add a new object to the array:

```javascript
{
    title: "NEW PUBLICATION",
    url: "https://example.com/new-article",
    date: "2024-01-15",
    description: "Description of new article"
}
```

### Editing an Existing Press Link

Simply find the item in the array and modify its properties.

### Removing a Press Link

Delete the entire object from the array.

## Formatting Notes

- The `title` will be displayed in all caps, with non-breaking spaces between words
- The `date` will be displayed as just the year (e.g., "2023")
- All press links will be indented under the "PRESS" section
- Links automatically open in a new tab when clicked

## Troubleshooting

If the press links don't appear:
1. Check the browser console for errors
2. Verify the `press-data.js` file is in the same directory as your HTML file
3. Make sure the file has proper JSON syntax

For any issues, the system will fall back to displaying a default set of links. 