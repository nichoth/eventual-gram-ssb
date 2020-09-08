# eventual-gram ssb




------------------------------------------------

[css grid - auto-fill](https://rachelandrew.co.uk/archives/2016/04/12/flexible-sized-grids-with-auto-fill-and-minmax/)

> To achieve a truly flexible grid – flexible both in size of tracks and number – we need an additional piece of the puzzle – minmax(). 

> This would result in tracks of a minimum of 100 pixels and a maximum of 1 fraction unit of the available space. After as many 100 pixel tracks are assigned, we then have the remaining space to distribute. Our tracks are allowed to be greater than 100 pixels wide so the remaining space is equally distributed. The result as many equal width, flexible sized columns as can fit inside the container.


----------------------------------------------

## 8-26-2020
"Implementing a browser is no longer inside the realm of what you would do for fun"

"we basically need to rebuild civilization, but within the real of stuff that at least someone would do for fun"


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



