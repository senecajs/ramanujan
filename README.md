# ramanujan

This project is an implementation of a microblogging system (similar
to the basic functionality of [Twitter](http://twitter.com)) using the
microservice architecture and Node.js. It is the example system
discussed in Chapter 1 of
[The Tao of Microservices](http://bit.ly/rmtaomicro) book.


This purpose of this code base to help you learn how to design and
build microservice systems. You can follow the construction through
the following steps:

  * Informal Requirements
  * Message specification
  * Service specification

The system uses the Seneca microservice framework to provide
inter-service communication, and the Fuge development tool to manage
services on a local development machine.

The system is also a demonstration of the SWIM protocol for
peer-to-peer service discovery. A service registry is not needed as
the network automatically reconfigures as microservices are added and
removed.

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

This example codebase does not provide a production deployment
configuration. To see such a configuration for a similar system, using
Docker, take a look at the NodeZoo code base.

## Running the system

The system is implemented in Node.js. You will need to have Node.js
version 4.0 or greater installed.

To run the system, follow these steps:

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

#### Step 1: Checkout the repository

Use git to checkout the repository to a local development folder of your choice

```sh
$ git checkout https://github.com/senecajs/ramanujan.git
```

#### Step 2: Download dependencies

The system needs a number of Node.js modules from npmjs.org to
function correctly. These are the only external dependencies.

```sh
$ npm install
```

Wait until the downloads complete. Some modules will require local
compilation. If you run into problems due to your operating system,
using a Linux virtual machine is probably your fastest solution.

#### Step 3: Run fuge

From within the repository folder, run the fuge shell.

```sh
$ fuge shell fuge/system.yml
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

#### Step 0: Load microblog timeline of user _foo_

Open `http://localhost:8000/foo`.

This is the homepage for the user _foo_, and shows their timeline. The
timeline is a list of recent microblog entries from all users that the
user _foo_ follows, and also entries from _foo_ themselves.


At first there are no entries, so go ahead and post an entry, say:

    _the color red_

[https://github.com/senecajs/ramanujan/blob/master/img/rm01.png]

Click the _post_ button or hit return. You should see the new entry.



#### Step 1: Post microblogs for user _foo_
#### Step 2: Review microblogs for user _foo_
#### Step 3: Load search page of user _bar_
#### Step 4: Set user _bar_ to follow user _foo_
#### Step 5: Post microblogs for user _foo_
#### Step 6: Load microblog timeline of user _bar_

### Starting and stopping services

### Accessing the network REPL


## Informal Requirements

## Message Specification

## Service Specification


