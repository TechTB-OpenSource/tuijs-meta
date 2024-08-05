# TUI-Meta
## A simple and easy utility that updates a web application's meta tags based on a provided set of site data.
***TUI-Meta is built on modules. A bundler is recommended.***

***Last Updated 08/05/2024***


## Getting Started
1. Ensure that you have a set of site data (We will refer to this as 'siteData') created. This can be a JSON file, data in a database, or an Object directly in your JS code. As long as the resulting data is an Object following the format below. For this example we will use a JSON file.
    - The 'siteData' will always consist of a parent Object.
    - The Objects contained within the 'siteData' parent Object should each represent a route path, except for the site wide data which should always be '\*'. The '\*' Object will represent data that is intended to be site wide, and can be empty or non-existent if desired. ***The Object names do not currently matter as long as they are referenced correctly when the 'tuiMeta' function is called. However, once TUI-Meta is integrated into TUI-Router, the naming standard for site data and route data will become important.***
    - Inside the value of each site or route Object, there will be two important keys, 'title' and 'meta'. The 'title' key value will be a string representing the title of the site or page. The 'meta' key value will be an Array of Objects containing meta tag attributes. Each Object can contain as many or as few attributes as needed, but each Object will only ever represent one meta tag.

```json
{
    "*": {
        "title": "Site Title",
        "meta": [
            {
                "property": "og:title",
                "content": "Title"
            },
            {
                "property": "og:description",
                "content": "description"
            },
            {
                "property": "og:image",
                "content": "image/path"
            },
            {
                "property": "og:url",
                "content": "https://site/path"
            },
            {
                "property": "og:type",
                "content": "website"
            }
        ]
    },
    "/": {
        "title": "Home Title",
        "meta": [
            {
                "name": "description",
                "content": "Home description"
            },
            {
                "name": "keywords",
                "content": "Home keywords"
            }
        ]
    },
    "/about": {
        "title": "About Title",
        "meta": [
            {
                "name": "description",
                "content": "About description"
            },
            {
                "name": "keywords",
                "content": "About keywords"
            }
        ]
    },
    "/contact": {
        "title": "Contact Title",
        "meta": [
            {
                "name": "description",
                "content": "Contact description"
            },
            {
                "name": "keywords",
                "content": "Contact keywords"
            }
        ]
    },
}
```

2. Import the primary function 'tuiMeta' from 'tui-meta'.
    - If you are working with a multi-page app, this should be in the JS file for each page.
    - If you you are working with a single-page app, this should be done where ever you route logic is.
    - ***The 'tuiMeta' function is exported as default.***

```js
import tuiMeta from 'tui-meta';
```

3. Execute the 'tuiMeta function' using the desired site or route data from the siteData source. ***It is important to note that you must use one of the seconds Objects as the parameter and NOT the full site data Object.***
    - In the following example, the site data is directly in the JS code and is provided as a parameter in the 'tuiMeta' function. In this case, the page head will populate with the HTML tags listed below.

```js
const siteData = {
    '*': {
        title: 'Site Title',
        meta: [
            {
                name: 'description',
                content: 'Site description'
            },
            {
                name: 'keywords',
                content: 'Site keywords'
            }
        ]
    },
}
tuiMeta(siteData['*']);
```
```html
<title>Site Title</title>
<meta name="description" content="Site description">
<meta name="keywords" content="Site keywords">
```

4. When the 'tuiMeta' function is called it will check the head for other existing meta tags that have key/value pairs that match exactly. If it finds any, they will be deleted allowing the new site or route meta data to be added. ***It should be noted that 'content' attributes are completely ignored during this check. So if a content key/value pair match, nothing will be deleted.***

## How It Works
1. When the 'tuiMeta' function is called, the site data provided is first checked to ensure that it is an Object.
2. The function then validates that the 'title' key exists.
    - If the 'title' key exists, the function attempts to update the document title with the 'title' key value.
    - If the 'title' key DOES NOT exists, no error is generated and the function just moved on.
2. The function then validates that the 'meta' key exists.
    - If the 'meta' key exists, the function then validates that the value of the 'meta' key is an Array, throwing an error if it is not.
    -If the 'meta' key value is an Array, then the function attempts to update the document meta tags with the 'meta' key Array data. As as reminder this Array consists of Objects, each representing a single meta tag. Within each Object, there is a set as many or as few key/value pairs as needed, each representing a single meta tag attribute and its value.
    - If the 'meta' key DOES NOT exists, no error is generated and the function just moved on.
