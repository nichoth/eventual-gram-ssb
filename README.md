# eventual-gram ssb

The electron apps are in the "releases" link to the right ->

------------------------------------

[public pubs](https://github.com/ssbc/ssb-server/wiki/pub-servers#public-pubs)

--------------------------------------

Start a dev server that automatically reloads on any change, with the `NODE_ENV` env variable set to 'development', which gives an `appName` of `ssb-ev-DEV`: 
```
$ npm start
```

Start the dev server, with no env variables set (defaults to appName of `ssb-ev`:
```
npm run open
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


## 10-14-2020
[flumeview-reduce](https://github.com/flumedb/flumeview-reduce#flumeviewreduceversion-reduce-map-codec-initialstate--flumeview)

need to use a store with flumeview-reduce, that way it will save the state

---------------------------------------

## 10-17-2020
I forgot what I wanted to make a PR for. I think it was in the flumeview docs,
I con't remember where though.

The PR was for the `store` docs in flumeview-reduce.

---------------------------------------------------

## 10-18-2020
Run the flume view exploration:
```
$ node test-flume-view/index.js 
```

### how does replication work?

[ssb-replicate legacy confusion](https://github.com/ssbc/ssb-replicate/issues/1)
"you do need ssb-replicate to be installed first"

"peers replicate by calling `createHistoryStream({id, seq})` for every feed to be replicated."

[protocol guide](https://ssbc.github.io/scuttlebutt-protocol-guide/#createHistoryStream)
"The RPC procedure `createHistoryStream` is how peers ask each other for a list of messages in a particular feed."

"Scuttlebutt peers make requests to each other using an RPC protocol. Typical requests include asking for the latest messages in a particular feed or requesting a blob"

[scuttle-testbot](https://github.com/ssbc/scuttle-testbot)

-----------------------------------------------------------

## 10-19-2020
[permissions](https://github.com/ssb-js/secret-stack/blob/main/src/core.ts#L109) in `secret-stack` and associated [gh issue](https://github.com/ssbc/ssb-server/issues/736)


## 10-20-2020
Tags index doesn't work with the app-name `ssb-ev-DEV`, but it does with `ssb-ev`. I think there is no content in the dev env. I'm not sure though why they would be different

How are records append to the log when replicating? If we wanted to replicate by say fetching log entries via http request, how would that work?


## 10-21-2020
Copying some stuff from patchwork: https://viewer.scuttlebot.io/%25f9pa8FparL%2FzQNwo%2B6qG9IBH4nxBfjeGgAAuIqdjtHg%3D.sha256

> Totally agreed, it’s unfortunate. I can share some of my data from reversing experiments.  
The ssb-ebt flavor of domnics ebt implementation also as a comparsion to plumtree section which also has some helpful pointers of what it is doing.  
The gist is this:  
open a duplex muxrpc stream to send arbitrary JSON objects between client and server.
each side sends their vector clock, a list of all the feeds they store and up to which sequence they have, as a giant json object like this:{ "@feed1":23, "@feed2":42, "@feed3":-120, ... }. Notice the negative there? that should be interepretated as dont send me newer messages of that feed, all the other feeds should be interpreted as send me updates eagerly. Also, the comparison section suggest to leave out entries in that object when a feed didn’t change.
send new messages of each feed where the other party has less then the host.  
update the vector clocks once you get new messages for a feed
this is basically it for the wire protocol. The rest is lots of local state about the vector clocks of all the peers the host was in contact with and one or more heuristics for electing which feed to get from which peer.  
My personal gripe: this way of having messages and vector clocks on the same channel glued the current weird signing format in even more. Adding a new one like bamboo or gabbygrove, we will have to re-evaluate this and I’d propose to just do the vector clock exchanges and having one channel per format or somehow framing it differently. Anyways it feels like a breaking change. Adding and option just to do the vector exchanges should hopefully be a simple start, though.  
Another problem: this is a distributed system with lots of state. If you happen to re-install your ssb identity because you only backed up the secret there is no clear way to reset your state across the network. One could think of a new message type for this but it currently isn’t implemented.  
HTH

-----------------------------------------

Read about [earthstar](https://github.com/earthstar-project/earthstar/blob/master/docs/overview.md) today. Looks very cool. It's nice to break down ssb and related things into their core comonents.

What is ssb really? 
* a merkle dag (or many; each feed is a merkle dag i think. Each markle-dag in this case is a different DB view)
* a DB (flumeDB)
* public/private key pair for identity
* append only log of different merkle trees

## earthstar
Need a tutorial -- a well written intro/how to use it document

see https://github.com/earthstar-project/earthstar/blob/master/src/readme-example.ts -- the comments are good

[syncing](https://github.com/earthstar-project/earthstar/blob/master/docs/syncing.md)

-------------------------------------

## 10-22-2020

Reading about [pigeon protocol](https://tildegit.org/PigeonProtocolConsortium/Protocol-Spec). Seems cool

discovered [gemini](https://gemini.circumlunar.space/docs/faq.html) protocol

read about [agregore](https://github.com/AgregoreWeb/agregore-browser) browser

------------------------------------------------

## 10-24-2020
Read about [radicle](https://radicle.xyz/) today. A [nice article](https://radicle.xyz/radicle-link.html)

From the article:
> Radicle Link extends Git with peer-to-peer network discovery. Taking inspiration from Secure Scuttlebutt,

Which is ironic, because I thought peer discovery was the weak point in the ssb system. It depends heavily on pub servers, and just maintains a simple list of peer (server) addresses to try to connect to.

What is radicle? I don't understand how it changes git/github.

> returning to a fully distributed model

It seems that radicle uses a 'local-first' approach with issues/project metadata in addition to the source code (git files).

-----------------------------------------

### hypercore
```
The Hypercore Protocol consists of three things:

An append-only log structure (Hypercore) designed for fast, secure replication between peers in peer-to-peer networks. Hypercore is our core primitive.
A DHT implementation that works well in home networks (Hyperswarm). We mainly use this for discovering and replicating Hypercores.
A few higher-level data structures built on top of Hypercores (Hyperdrive, Hypertrie), for constructing filesystems and kv-stores.
```

Reading about [hyperswarm](https://pfrazee.hashbase.io/blog/hyperswarm) now.

Hyperswarm is a kademlia DHT. Includes a way to **holepunch** nats. (This means direct p2p connections, not using a pub server)

Devices join topics by listing their IP so that other devices can establish connections.

Hyperswarm would be used by an application to find peers and connect

### hyperspace
> Hyperspace is a lightweight service that provides remote access to Hypercores/Hyperswarm, and nothing more

> the server keeps a long-running Hyperswarm node online for you

### hyperswarm
[hyperswarm](https://pfrazee.hashbase.io/blog/hyperswarm) 
> Hyperswarm is a stack of networking modules for finding peers and creating reliable connections. Users join the swarm for a “topic” and query periodically for other peers who are in the topic. When ready to connect, Hyperswarm helps create a socket between them using either UTP or TCP.
> Hyperswarm uses a Kademlia DHT to track peers and arrange connections. The DHT itself includes mechanisms to holepunch NATs. For LAN-based discovery, we currently use multicast DNS.

[article about dat-photos](https://medium.com/blue-link-labs/building-a-decentralized-peer-to-peer-photos-app-with-beaker-and-dat-c8a470202b4c)

> The Photos app takes advantage of Beaker’s DatArchive API, which has methods for reading and writing the user’s filesystem 

--------------------------------------------------------

11-1-2020
Getting the gossip was slowing down everything for some reason. It made getting the avatar much slower in this case.

-----------------------------------------------

## 11-4-2020
Reading about arj's project ssb-browser -- %urkKJmW7VXq8mF1VPK2f5LFYjKOxvxPegPRT0Z4R2VU=.sha256

> Time for the next installment of #ssb-show-and-tell. I just made a release of [ssb-browser-core](https://github.com/arj03/ssb-browser-core) and [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) that now supports rooms. I've been talking on and off with [@andrestaltz](@QlCTpvY7p9ty2yOFrv1WU1AE88aoQc4Y7wYal7PFc+w=.ed25519) for the last month or so about rooms and wanted to put it into browser so I could see how it really works. With this it is much easier for two browsers to sync directly. The only thing left for easier onboarding was partial replication so I implemented the current version to see two browsers syncing like this:

> ![browsers-partial-sync.jpg](&4qRjdG6n8boGHNQ/+4DWHPDyf6FqFPCiRmvuhk1AivY=.sha256)

> I'm currently working on a better design for partial replication so this is mostly a tech demo.

> Besides these changes I switched from [flumelog-aligned-offset](https://github.com/flumedb/flumelog-aligned-offset) to [async-flumelog](https://github.com/flumedb/async-flumelog) as I could never get aligned offset completely stable. It has some nice performance improvements compared to normal [flumelog-offset](https://github.com/flumedb/async-flumelog#benchmarks). Lastly jitdb now loads indexes lazily so startup is better and memory usage also improved because of this.

---------------------------------------------------

## 11-7-2020
Watched [this video](https://www.youtube.com/watch?v=nOSB177SfEM&feature=youtu.be&t=380) by arj. It doesn't go into detail about the ssb-browser system, it's quite a high level video in general.

Also, [the blog post](https://people.iola.dk/arj/2020/02/18/secure-scuttlebutt-in-a-browser/) about ssb-browser. Links to [random-access-web](https://github.com/random-access-storage/random-access-web)

Found this [ssb-web-extension](https://github.com/powersource/ssb-webextension-demo/) demo

[a video demo of ssb-browser](https://hooktube.com/watch?v=E8pnc2N1XHo&feature=youtu.be)

* https://github.com/ssbc/ssb-ooo
* https://github.com/arj03/ssb-get-thread
* https://github.com/powersource/ssb-webextension-demo/
* https://github.com/arj03/ssb-browser-core
* https://github.com/arj03/ssb-browser-demo
* https://github.com/arj03/ssb-partial-replication
* https://hooktube.com/watch?v=E8pnc2N1XHo&feature=youtu.be
* [blog article about ssb-browser](https://people.iola.dk/arj/2020/02/18/secure-scuttlebutt-in-a-browser/)
* [HOW TO SETUP A PUB FOR SSB BROWSER](https://people.iola.dk/arj/2020/03/04/how-to-setup-a-pub-for-ssb-browser/)
* https://github.com/random-access-storage/random-access-web
* [a great article -- ink and switch](https://www.inkandswitch.com/local-first.html)

## 11-8-2020
This list comes from https://www.inkandswitch.com/local-first.html
* Alexei Baboulevitch’s Data Laced with History
* Martin Kleppmann’s Convergence vs Consensus (slides)
* Shapiro et al.’s comprehensive survey
* Attiya et al.’s formal specification of collaborative text editing
* Gomes et al.’s formal verification of CRDTs

* https://github.com/automerge/automerge
* https://github.com/automerge/hypermerge

https://people.iola.dk/arj/2020/02/18/secure-scuttlebutt-in-a-browser/
Read this great blog post today

------------------------------------------------

## 12-28-2020

Should have `view`, `app`, `subscribe`

watched the [arj video](https://hooktube.com/watch?v=E8pnc2N1XHo&feature=youtu.be)


## 12-29-2020
Rewriting the app structure

--------------------------------------------------

## 1-2-2021

I think the best thing to do is to keep any tests that require us to call `sbot` functions in the `tape-run` version, because cypress is weird with the rpc sbot calls. It's like any interaction in cypress has to be done through the DOM.


----------------------------------------

## 1-19-2021

* [who are you following?](https://scuttlebot.io/docs/social/query-the-social-graph.html)
  - try `gossip.peers(cb)`

* Get the current peerlist -- [gossip](https://scuttlebot.io/apis/scuttlebot/gossip.html)








