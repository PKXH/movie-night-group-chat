# movie-night-group-chat
Web-based group chat for the movie night crowd ;)

## Installation
1. Install **node.js** ([via your favorite package manager](https://nodejs.org/en/download/package-manager/))
2. Install **npm** (via your favorage package manager)
3. [Install](https://docs.mongodb.com/v3.2/administration/install-community/) **MongoDB**.
3. Clone the **movie-night-group-chat** repo.
4. Open console, `cd` into the cloned repo directory and type `npm init`, following setup defaults.
5. Use `npm install <module>` to install **express**, **socket.io**, **ejs**, and **commander** modules.
6. Unblock port **8082**, if firewalled.

## Run Procedure
1. Start MongoDB daemon: `/usr/local/opt/mongodb-community\@3.2/bin/mongod --config /usr/local/etc/mongod.conf` (or something similar; see [MongoDB's instructions for running as a service](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb-community-edition))
2. Start chat page service: `node index.js --port=8082 --key=chat`
3. Connect to chat by pointing browser at `http://xxx.xxx.xxx.xxx:8082/chat`

## Shutdown Procedure
1. Stop chat service with `ctrl-C`.
2. Stop MongoDB daemon with `ctrl-C` (if started as a service, see [MongoDB's instructions for stopping service](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb-community-edition)).

## Erasing Chat History
1. Start MongoDB daemon: `/usr/local/opt/mongodb-community\@3.2/bin/mongod --config /usr/local/etc/mongod.conf` (or something similar; see [MongoDB's instructions for running as a service](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb-community-edition))
2. Start "mongo" shell by typing `/usr/local/opt/mongodb-community\@3.2/bin/mongo` (or wherever it is on your system).
3. In the mongo shell, type `use chat`.
4. In the mongo shell, type `db.chats.drop()`. A return value of `true` indicates the chat data has been purged.

## Troubleshooting
1. If you are testing on `localhost` or an isolated LAN, some of your remote-hosted CDN packages may not load and the chat may "partially" "work".
