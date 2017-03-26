# ramanujan

This project is an implementation of a microblogging system (similar
to the basic functionality of [Twitter](http://twitter.com)) using the
[microservice architecture](http://www.richardrodger.com/seneca-microservices-nodejs#.VyCjoWQrL-k)
and [Node.js](https://nodejs.org). It is the example system discussed
in Chapter 1 of [The Tao of Microservices](http://bit.ly/rmtaomicro)
book.


This purpose of this code base to help you learn how to design and
build microservice systems. You can follow the construction through
the following steps:

  * [Informal Requirements](#informal-requirements)
  * [Message specification](#message-specification)
  * [Service specification](#service-specification)

The system uses the
[Seneca microservice framework](http://senecajs.org) to provide
inter-service communication, and the
[fuge microservice development tool](https://github.com/apparatus/fuge) to manage
services on a local development machine.

The system is also a demonstration of the
[SWIM protocol](https://www.cs.cornell.edu/~asdas/research/dsn02-swim.pdf)
for peer-to-peer service discovery. A service registry is not needed
as the network automatically reconfigures as microservices are added
and removed.

## Scope of the system

The system shows implementations of some of the essential features of
a microblogging system, but not all. Of particular focus is the use of
use of separate microservices for separate content pages, the use of
messages for data manipulation, and the use of a reactive message flow
for scaling.

The system does not provide for full accounts, or user
authentication. This could be added relatively easily using the
seneca-auth and seneca-user plugins. Avoiding the need to login makes
it easier to experiment as you can check multiple user experiences in
the browser.

The system exposes a (RESTish) JSON API over HTTP. However, the user
interface does _not_ use any client-side JavaScript, and entirely
delivered by server-side templates. This is an old school POST and
redirect architecture to keep things simple and focused on the
server-side.

The system does not use persistent storage. You can easily make the
data persistent by using a Seneca data storage plugin. Keeping
everything in memory makes for faster development, easier
experimentation, and lets you reboot the system if you end up with
corrupted data during development.

This system also provides an example of message tracing, using <a
href="http://zipkin.io/">Zipkin</a>.

This example codebase does not provide a production deployment
configuration. It does however provide a Docker Swarm example that you
can start building from.


## Unit test examples

The system also includes example code for unit testing microservices.
The unit test code for each service is in the `test` subfolder of each
microservice folder.

To run all the tests, use:

``js
npm test
``

The microservices can be unit tested independently and offline. Mock
messages are used to isolate each microservice from its network
dependencies.


## Running the system

The system is implemented in Node.js. You will need to have Node.js
version 4.0 or greater installed.

You can run the system directly from the command line by running the
`start.sh` script:


```sh
$ ./start.sh
```

This starts all the microservices in the background. While this is a
quick way to get started, and verify that everything works, it is not
the most convenient option.

To have more control, you can use
[fuge](https://github.com/apparatus/fuge) to run the microservice
processes. Detailed instructions are provided next.

You can also use Docker to run the services. Example Dockerfiles are
provided in the
[docker folder](https://github.com/senecajs/ramanujan/tree/master/docker). See
below for more details.



## Running with fuge


#### Step 0: Install fuge

Follow the instructions at [fuge repository](https://github.com/apparatus/fuge).

_fuge_ is a development tool that lets you manage and control a
microservice system for local development. The ramanjun repository is
preconfigured for fuge (see the fuge folder), so you don't have to set
anything up. The ramanujan system has 14 microservices (at last
count), so you really do need a local tool to help run the system.

This is trade-off that you make when you choose the microservice
architecture. You can move faster because you have very low coupling,
and thus lower technical debt, but you will need more automation to
manage the higher number of moving parts.

#### Step 1: Clone the repository

Use git to clone the repository to a local development folder of your choice

```sh
$ git clone https://github.com/senecajs/ramanujan.git
```

#### Step 2: Download dependencies

The system needs a number of Node.js modules from npmjs.org to
function correctly. These are the only external dependencies.

```sh
$ npm install
```

Wait until the downloads complete. Some modules will require local
compilation. If you run into problems due to your operating system,
using a [Linux virtual machine](https://www.virtualbox.org/) is
probably your fastest solution. If you are using Windows,
[configuring msbuild](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules)
first is a good place to start.


The Zipkin message tracing is optional, and the system will work fine
if there is no Zipkin installation. However, it is pretty easy to set
one up using <a href="http://docker.com">Docker</a>:

```sh
$ docker run -d -p 9411:9411 openzipkin/zipkin
```

Once you've run through some of the use cases, open <a
href="http://localhost:9411/">http://localhost:9411/</a> to see the
message traces. Note that this is a demonstration system, so all
traces are captured. In production you'll want to use a much lower
sampling rate - see the Zipkin documentation for details.




#### Step 3: Run fuge

From within the repository folder, run the fuge shell.

```sh
$ fuge shell fuge/fuge.yml
```

This will start fuge, output some logging messages about the ramanujan services, and then place you in an interactive repl:

```sh
...
starting shell..
? fuge>
```

Enter the command `help` to see a list of commands. Useful commands
are `ps` to list the status of the services (try it!), and `exit` to
shutdown all services and exit. If your system state becomes corrupted
in some way (this often happens during development due to bugs in
microservices), exit fuge completely and restart the fuge shell.


#### Step 4: Start up the system

To start the system, use the fuge command:

```sh
...
? fuge> start all
```

You see a list of startup logs from each service. _fuge_ prefixes the
logs for each service with the service names, and gives them different
colors so they are easy to tell apart. This also makes is easy to
review message flows. The system takes about a few seconds to start
all microservices.

Now use the `ps` command to list the state of the services. They
should all be running.

### Using the system

Open your web browser to interact with the system. The steps below
define a "happy path" to validate the basic functionality of the
system.

#### Step 1: Post microblogs entries for user _foo_

Open `http://localhost:8000/foo`.

This is the homepage for the user _foo_, and shows their timeline. The
timeline is a list of recent microblog entries from all users that the
user _foo_ follows, and also entries from _foo_ themselves.


At first there are no entries, so go ahead and post an entry, say:

> _three colors: blue_

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm01.png" width="440">

Click the _post_ button or hit return. You should see the new entry.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm02.png" width="440">

Post another entry, say:

> _three colors: white_

You should see both entries listed, with the most recent one at the
top. This is the timeline for user _foo_.


#### Step 2: Review microblogs for user _foo_

Open `http://localhost:8000/mine/foo` (Or click on the _Mine_ navigation tab).

This shows only the entries for user _foo_, omitting entries for followers.

You can use this page to verify the entry list for a given user.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm03.png" width="440">


#### Step 3: Load search page of user _bar_, and follow user _foo_

Open `http://localhost:8000/search/bar`.

You are now acting as user _bar_. Use the text _blue_ as a search query:

Click on the _follow_ button. Now user _bar_ is following user _foo_.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm04.png" width="440">


#### Step 4: Review timeline for user _bar_

Open `http://localhost:8000/bar` (Or click on the _Home_ navigation tab).

You should see the entries from user _foo_, as user _bar_ is now a follower.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm05.png" width="440">


#### Step 5: Post microblog entries for user _bar_

Enter and post the text:

> _the sound of music_

The timeline for user _bar_ now includes entries from both users _foo_
and _bar_.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm06.png" width="440">


#### Step 5: Post microblog entries for user _foo_

Return to user _foo_. Open `http://localhost:8000/foo`.

Post a new entry:

> _three colors: red_

You should see entries only for user _foo_, as _foo_ does **not** follow _bar_.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm07.png" width="440">


#### Step 6: Load microblog timeline of user _bar_

Go back to user _bar_. Open `http://localhost:8000/bar`.

You should see an updated list of entries, included all the entries
for user _foo_, as _bar_ **does** follow _foo_.

<img src="https://github.com/senecajs/ramanujan/blob/master/img/rm08.png" width="440">


### Starting and stopping services

One of the main benefits of a microservice system is that you can
deploy services independently. In a local development setting this
means you should be able to start and stop services independently,
without stopping and starting the entire system. This has a huge
productivity benefit as you don't have to wait for the entire system
to ready itself.

To work on a particular service, update the code for that service, and
then stop and restart the service to see the new functionality. The
rest of the system keeps working. To really get the maximum benefit
from this technique, you need to avoid the use of schema validation
for your messages, and you must avoid creating hard couplings
(services should not know about each other). That is why the Seneca
framework provides pattern matching and transport independence as key
features - they enable rapid development.

The payoff for more deployment complexity is that you can change parts
of the system dynamically - don't lose that ability!

_fuge_ allows you to start and stop services using the 'start' and
'stop' commands.

To stop a service (say, _search_), use the command:

```sh
? fuge> stop search
```

If you now try to use the search feature, it will fail, but other
pages will still work. Another important benefit of microservices is that they can isolate errors in this way.

To restart the _search_ service, use:

```sh
? fuge> start search
```

And the search functionality works again. Notice that you did not have
to do any manual configuration to let the other services know about
the new instance of the _search_ service. Notice also that the other
services knew almost instantaneously about the the new instance of the
_search_ service. That's becuase the SWIM algorithm propogated that
information quickly and efficiently throughout the network. No need
for 30 second timeouts to detect errors - SWIM works much more quickly
as it has many observers (the other services) so can detect failure,
and new services, very quickly with a high degree of confidence.

You can also run multiple instances of the same service. This lets you
scale to handle load. The underlying seneca-mesh network will
automatically round-robin messages between all available services for
a given message. Just start the service again:

```sh
? fuge> start search
```

And is you now run the `ps` command in fuge, you'll see the count is 2
instances.


### Accessing the network REPL

The system comes with a REPL service that lets you submit messages to the network manually. This is very useful for debugging. Access the REPL by telnetting into it:

```sh
$ telnet localhost 10001
```

Use the following message to see the user _foo's_ timeline:

```sh
seneca 2.0.1 7k/repl> timeline:list,user:foo
IN  000000: { timeline: 'list', user: 'foo' } # t7/39 timeline:* (6ln6zlc2qaer) transport_client
OUT 000000: { '0':
   { user: 'foo',
     text: 'three colors: red',
     when: 1461759716373,
     can_follow: false },
  '1':
   { user: 'foo',
     text: 'three colors: white',
     when: 1461759467135,
     can_follow: false },
  '2':
   { user: 'foo',
     text: 'three colors: blue',
     when: 1461759353996,
     can_follow: false } }
```

You can enter messages directly into the terminal, in JSON format (the
format is lenient, see
[jsonic](https://github.com/rjrodger/jsonic)). The output will show
the message data `IN` and `OUT` of the network.

The REPL is a JavaScript console environment. There is a `seneca`
object that you can use directly, calling any methods of the seneca
API.

```sh
seneca 2.0.1 7k/repl> seneca.id
'7k/repl'
```

To get a list of all services on the network, and which messages they
listen for, try:

```sh
seneca 2.0.1 7k/repl> role:mesh,get:members
IN  000001: { role: 'mesh', get: 'members' } # aa/ie get:members,role:mesh (9mxp6qx6zyox) get_members
OUT 000001: {
  ...
  '4':
   { pin: 'timeline:*',
     port: 54932,
     host: '0.0.0.0',
     type: 'web',
     model: 'consume',
     instance: 'gt/timeline-shard' },
  ...
  }
```

This message is so useful, that the repl service defines an alias for it: `m`.

The default configuration of the system uses shortened identifers to
make debugging easier.


### Using the monitor

You can monitor the state of each service, and the message patterns
that it responds to, by running the `monitor` service separately in
it's own terminal window. The `monitor` service prints a table of
showing each service, and dynamically updates the table as services
come and go. See
[seneca-mesh](https://github.com/senecajs/seneca-mesh) for details.

```sh
$ node monitor/monitor.js 
```


## Using Docker

You'll need to have the latest version of
[Docker](https://www.docker.com/) installed.

The [docker](https://github.com/senecajs/ramanujan/tree/master/docker)
folder contains Docker image setup Makefiles and Dockerfiles. Run the
top level `Makefile` to build all the images:

```
$ cd docker
$ make
```

Then deploy all the images using Docker Stack:

```
$ docker stack deploy -c ramanujan.yml ramanujan
```

This will start up everything. The containers run in their own overlay
network, but you will be able to access the website and repl on
localhost as with fuge.

If things go funny (hey, it's Docker), delete the stack, restart
Docker, and try again:

```
$ docker stack rm ramanujan
```

You can see some information about the containers with these commands:

```
$ docker stats
$ docker services ls
$ docker ps
```

To view the monitor, run the it on the `repl` container:

```
$ docker exec -it `docker ps | grep repl | cut -f 1 -d ' '` /bin/sh
# node monitor.js
```


## Informal Requirements

> TODO

## Message Specification

> TODO

## Service Specification

> TODO

## Help and Questions

[github issue]: https://github.com/senecajs/ramanujan/issues
[gitter-url]: https://gitter.im/senecajs/ramanujan


## License
Copyright (c) Richard Rodger and other contributors 2015-2016, Licensed under [MIT](/LICENSE).
