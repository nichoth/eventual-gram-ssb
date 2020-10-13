# eventual-gram ssb

The electron apps are in the "releases" link to the right ->

--------------------------------------

Start a dev server that automatically reloads on any change
```
$ npm start
```

Open a test GUI
```
npm run cy:open
```

Run some tests with no GUI
```
npm run test-browser
```

Make a new electron release
```
npm run release
```

Open electron with the built app
```
npm run tron
```


## notes
------------------------------------------------

[css grid - auto-fill](https://rachelandrew.co.uk/archives/2016/04/12/flexible-sized-grids-with-auto-fill-and-minmax/)

> To achieve a truly flexible grid – flexible both in size of tracks and number – we need an additional piece of the puzzle – minmax(). 

> This would result in tracks of a minimum of 100 pixels and a maximum of 1 fraction unit of the available space. After as many 100 pixel tracks are assigned, we then have the remaining space to distribute. Our tracks are allowed to be greater than 100 pixels wide so the remaining space is equally distributed. The result as many equal width, flexible sized columns as can fit inside the container.


----------------------------------------------

## 8-26-2020
"Implementing a browser is no longer inside the realm of what you would do for fun"

"we basically need to rebuild civilization, but within the realm of stuff that at least someone would do for fun"


------------------------------------------------


## 8-28-2020
It's nice that everything is local on your computer. You don't need any connection to start developing.

[get a profile](https://scuttlebot.io/docs/social/view-a-profile.html) .
See `app.getProfileById`

-----------------------------------------------------------

## 8-29-2020

[about messages](https://scuttlebot.io/docs/message-types/about.html)
[sbot.links](https://scuttlebot.io/apis/scuttlebot/ssb.html#links-source)


----------------------------------------------

## 8-30-2020
The DB has seemingly been borked twice.


----------------------------------------------


## 8-31-2020
To create databases for testing, you can specify a different data-directory using the ssb_appname environment variable. For instance:
```
ssb_appname=test ssb-server start
```

The primary user's private key is kept in the `~/.ssb/secret` file.

If you want to set a new primary user, while still using the same database, you can move `~/.ssb/secret` to some other location (eg `~/.ssb/secret.backup`). Scuttlebot will automatically create a new user and secret, when started next.

[create test users](https://scuttlebot.io/docs/config/creating-test-users.html)

[create a test DB](https://scuttlebot.io/docs/config/creating-test-databases.html)

[create secondary users](https://scuttlebot.io/docs/basics/create-secondary-users.html)

see [ssb-feed](https://www.npmjs.com/package/ssb-feed)

```js
var ssbFeed = require('ssb-feed')
var ssbKeys = require('ssb-keys')

// create the new feed
var alice = ssbFeed(sbot, ssbKeys.generate())

// Post to alice's feed
alice.publish({
  type: 'post',
  text: 'hello world, I am alice.'
}, function (err) { ... })
```

How does that know where to store messages? It takes an `sbot` param.


[scuttlebutt](https://github.com/dominictarr/scuttlebutt) -- is this the DB layer with a stream interface for replication like i had wanted?


Need to run a second instance of ssb at the same time as the main instance

I think the `ssb-db` plugin was messing it up


----------------------------------------------------

## 9-1-2020

Need to make a second user in an automated way, for tests.


----------------------------------------------------------

## 9-3-2020
[messages by user](https://scuttlebot.io/docs/advanced/messages-by-user.html) -- for the `/userId` route

found [this testbot](https://github.com/ssbc/scuttle-testbot) today

can set the avatar


-----------------------------------------------------

## 9-4-2020

---------------------------------------------------

## 9-5-2020

* got the avatar to show next to all posts in home route


-----------------------------------------------------------

## 9-6-2020

[x] Make a test that writes to a new feed.

Need to find out how to 'replicate' with another feed

---------------------------------------------------------------

## 9-10-2020

* [x] make a route for pubs
* [x] just need an input that takes an invite code

sbot automatically adds the messages `pub` and `contact` it seems. Don't need to write them yourself

------------------------------------------------

## 9-12-2020

Hoping that cypress uses an electron browser by default b/c then I can use ssb-keys to create a second feed, like int the test-browser command.

cypress
> Try running the tests in the examples folder or add your own test files to cypress/integration.

> `describe` and it come from Mocha
> `expect` comes from Chai

> A solid test generally covers 3 phases:
Set up the application state.
Take an action.
Make an assertion about the resulting application state.


[eslint plugin](https://github.com/cypress-io/eslint-plugin-cypress)

> Don’t try to start a web server from within Cypress scripts. Read about best practices here.

```js
{
  "baseUrl": "http://localhost:8080"
}
```

--------------------------------------------------

## 9 - 14 - 2020

Attaching an `sbot` to the window doesn't work. Maybe cypress runs in a separate processes from the browser app?

[x] Need to set env variables in the cypress tests. `NODE_ENV` should be `test`.
[ ] need to make a post with an image

The best part about cypress is the GUI interface. Otherwise `tape-run` is preferable. 



------------------------------------------------------------

## 9-15-2020

Testing multiple feeds.

need a function on window that posts from feed 2

Should have a button or something that lets you 'follow' the person.



--------------------------------------------------------

test from another feed
call `window.ev.alice._publish`. `alice.publish` is a different method that is defined server-side. `_publish` is the one we have made client-side


-----------------------------------------------------

## 9-16-2020

Need to have a list of people you are already following. I don't see a method in ssb that does exactly that though.

https://handbook.scuttlebutt.nz/guides/ssb-server/tutorial -- good thing. More documentation on ssb

https://scuttlebot.io/docs/social/query-the-social-graph.html -- sbot.friends example. `friends.steam` You can see who follows whom

more great [help from cel](https://viewer.scuttlebot.io/%25yV5uPldfAJR6SLEMP1dwl0%2BGy7upgksf1R565DKYiFM%3D.sha256) re: how to get a list of id's that you follow

Was starting to look at ways of making an sbot plugin (a materialized DB view) b/c reducing the `contact` messages at runtime was taking much too long.

Looking at the [source](https://github.com/ssbc/ssb-friends) of ssb.friends shows there is another method for getting your follows that must have been added after the [docs](https://scuttlebot.io/docs/social/query-the-social-graph.html) were written. [sbot.friends.isFollowing](https://github.com/ssbc/ssb-friends#isfollowingsource-dest-cb) seems to be what we need.


----------------------------------------------------------

## 9 - 17 - 2020
Found out that cbglh has a [website](https://cblgh.org/four-nights-in-tornio/).


----------------------------------------------------------------


## 9 - 18- 2020
Looking at how to publish an ssb log as a website
https://github.com/noffle/ssb-webify
https://git.scuttlebot.io/%25MeCTQrz9uszf9EZoTnKCeFeIedhnKWuB3JHW2l1g9NA%3D.sha256

ssb viewer [render a message](https://git.scuttlebot.io/%25MeCTQrz9uszf9EZoTnKCeFeIedhnKWuB3JHW2l1g9NA%3D.sha256/blob/38c61a5069cfd7444fd36af69b49b22d92af5f4d/render.js#L408)

* create a pull stream of the feed
* pipe that into a render function

[ssb-viewer](https://git.scuttlebot.io/%25MeCTQrz9uszf9EZoTnKCeFeIedhnKWuB3JHW2l1g9NA%3D.sha256/blob/38c61a5069cfd7444fd36af69b49b22d92af5f4d/index.js#L242) uses `sbot.createLogStream`

we want [messages by type](https://scuttlebot.io/apis/scuttlebot/ssb.html#messagesbytype-source)

or

[createFeedStream](https://scuttlebot.io/apis/scuttlebot/ssb.html#messagesbytype-source) -- get all messages

or

[create user stream](https://scuttlebot.io/apis/scuttlebot/ssb.html#createuserstream-source) -- get all messages by you

Will need to filter them in any case, either by user or by type


[tonic](https://tonic.technology/)


------------------------------------------------

## 9-19-2020
 Today
* use minimist to take appname as an argument in ssb-web
* finish ssb-web so you can finish your website
* use default appname of `ssb`

--------------------------------------------------------

## 10-4-2020
* found [suggest-box](https://www.npmjs.com/package/suggest-box)
* [ssb-suggest](https://www.npmjs.com/package/ssb-suggest)
* [ssb-tags](https://www.npmjs.com/package/ssb-tags)
* [scuttle-tag](https://www.npmjs.com/package/scuttle-tag)
* [ssb-markdown](https://www.npmjs.com/package/ssb-markdown)

In patchwork, they say [getChannelSuggestions](https://github.com/ssbc/patchwork/blob/33bda27b8cca77badcd0c336d1d6bf580c8ff077/lib/depject/suggest.js#L24)

*Messages are stored as markdown*

```js
function suggester (word, cb) {
    if (word[0] === '#') {
        lookupTags(word, cb)
    }
    else cb(null)
}
```

--------------------------------------------------------

## 10-5-2020
See [scuttle-tag/getSuggestions](https://github.com/ssbc/scuttle-tag/blob/master/async/getSuggestions.js)

Found [ssb-marked](https://www.npmjs.com/package/ssb-marked)

### suggesting hashtags

### creating html from markdown
Should have just a hashtag (#inktober) in the markdown. It gets tranformed to html
with a link in its place. 

Links in patchwork are like `<a href="#inktober">#inktober</a>`. Just the hashtag

#### ssb-marked
Is there a token for hashtags?

```js
var marked = require('ssb-marked')
var text = 'foo bar #hashtag [ok woo](/ok-now)'

var out = marked(text)
console.log('out', out)
```

```
out <p>foo bar <a href="#hashtag">#hashtag</a> <a href="/ok-now">ok woo</a></p>
```

`ssb-marked` already has a transformation for hashtags into links built in.
That was easy. I was getting ready to dig into the lexer and renderer, but no need. Now just need to get the suggestions working.

Actually, still need to create the hashtags in the database and apply them to the post.

#### ssb-suggest
It looks like ssb-suggest is just for usernames. Should try [suggest-box](https://www.npmjs.com/package/suggest-box) + [scuttle-tag/getSuggestions](https://github.com/ssbc/scuttle-tag/blob/master/async/getSuggestions.js).

scuttle-tag and suggest-box both work per-word, so that's good

suggest-box gets the latest word from the textarea, can pass the word to `scuttle-tag.getSuggestions`


-------------------------------------------------------------

## 10-6-2020
Need a way to get all the tags in a message. Then you can create them before publishing. See [hashtag](https://www.npmjs.com/package/hashtag) on npm.

[scuttle-tag getSuggestions in the wild](https://github.com/ssbc/patchwork/blob/33bda27b8cca77badcd0c336d1d6bf580c8ff077/lib/depject/tag/async/suggest.js#L16)

Stumbled on [ssb-msg-content](https://github.com/ssbc/ssb-msg-content). that's helpful.



## 10-7-2020
Saw [this moxie video](https://www.youtube.com/watch?v=Nj3YFprqAr8)

**On new post**
First check if the tags exists
  * need to get all the existing tags
  * get the 'about' messages for the existing tags
  * check if the inputted tag names are the same as existing 'about' messages
    - if so, use the existing tag
    - if not the same as any existing 'about' message, create a new tag & name the tag



Looking up what the 'about' messages look lkke
```js
{ type: 'about', about: tag, name }
```


## 10-11-2020

Want to look at flumeviews & start making a DB view of the tags that we need. But should get autocomplete working first.

`ssb-suggest` looks like it's only for usernames. Could use `suggest-box` though.


-----------------------------------------------------

## 10-12-2020
Writing a flumeview for tags

https://handbook.scuttlebutt.nz/guides/ssb-server/tutorial

Try `flumeUse` with a view

see https://github.com/flumedb/flumeview-hashtable/blob/master/test/simple.js

`_flumeeUse(name, flumeview)`


---------------------------------------------------------
## 10-13-2020

https://github.com/ssbc/ssb-db#db_flumeuse-view

https://github.com/flumedb/flumedb#flumedbusename-createflumeview--self

try publishing after adding a flumeView





