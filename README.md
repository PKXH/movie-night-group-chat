# movie-night-group-chat
Web-based group chat for the movie night crowd ;)

## Installation
1. Install **node.js** ([via your favorite package manager](https://nodejs.org/en/download/package-manager/))
2. Install **npm** (via your favorage package manager)
3. [Install](https://docs.mongodb.com/v3.2/administration/install-community/) **MongoDB**.
3. Clone the **movie-night-group-chat** repo.
4. Open console, `cd` into the cloned repo directory and type `npm init`, following setup defaults.
5. Use `npm install <module>` to install **express**, **socket.io**, **ejs**, and **commander** modules.
6. Unblock port **8082** and **27017**, if firewalled.

## Run Procedure
1. Start MongoDB daemon: `/usr/local/opt/mongodb-community\@3.2/bin/mongod --config /usr/local/etc/mongod.conf` (or something similar)
2. Start chat page service: `node index.js --port=8082`
3. Connect to chat by pointing browser at `http://xxx.xxx.xxx.xxx:8082`

## Shutdown Procedure
1. Stop chat service with `ctrl-C`.
2. Stop MongoDB daemon with `ctrl-C`.
