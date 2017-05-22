# citizenEngagement

This is the final deliverable of the [DFA course](https://github.com/MediaComem/comem-masrad-dfa).
The purpose was to build a front-end app allowing an user to report issues encountered in a city.

I wanted to make a single page app, simple to use with all the needed tools at fingertips.

## Requirements
I did the mandatory part. And I lost myself in details so I didn't have time for the bonus part.
The code is documented.
In index.html, you'll find the purpose for each js file, in js files, you'll find the rest of comments

> A citizen must be able to register a new account and log in/out to the app

We did the biggest part during the course. I added a double password check with a custom directive.

> A citizen must be able to report an issue at a specific location, with a description, a type of issue and optional tags

I added a button at the bottom right of the map. When user clicks on the map, it opens a modal. All the mentioned attributes can be filled in the modal with validation prior POST request.

> A citizen must be able to see issues on a map of the area and see the details of those issues

The issues are on a list and on the map at the same time. Details can be seen on the list. the list is actually composed of accordions. I wanted to open the corresponding accordion when user clicks on a marker. I didn't make it. However, when accordion is open, the state changes to a nested state and the map zooms to the selected issue. The purpose of this is to be able to share a link directly to an issue.

> A citizen must be able to filter issues by type so as to see only some issues (on the map and/or in other screens)

I did the filter, but just on types. I kept the filter aside thinking I will have time to complete it with other attributes.
I used an additional library here. A multi select dropdown menu which I find easy to use.

> A citizen must be able to search issues (on the map and/or in other screens)

There are two ways of doing this, with another request to the api/issues/searches or in the array of all issues with a filter. I like the second option, it's really cool to type some text in that box and see the issues disapearing. Also it's fast but the filter is only on description now.

> A citizen and a staff member must be able to post comments on issues and to see comments for an issue somewhere in the app

I added all that in the issue details. There's a small textarea with validation to add a comment. It would be nice to add some color to our own comments.

## How to run it
App is deployed here: http://arrr.ch

The assets are on a CDN except for one. (I didn't find a CDN for ngGeolocation)
Then:
```live-server --entry-file=index.html```

