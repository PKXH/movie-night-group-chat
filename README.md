# movie-night-group-chat
Web-based group chat for the movie night crowd ;)

## Installation
1. Install **webfs** web server (via your favorite package manager)
2. Install **node.js** ([via your favorite package manager](https://nodejs.org/en/download/package-manager/))
3. Install **npm** (via your favorage package manager)
4. Clone the **movie-night-group-chat** repo.
5. Open console, `cd` into the cloned repo directory and type `npm init`, following setup defaults.
6. Use `npm install <module>` to install **express**, **socket.io**, **ejs**, and **commander** modules.
7. Unblock port **8081** and **8082**, if firewalled.

## Run Procedure
1. Start chat page web server: `sudo webfsd -F -p 8081 -f index.html`
2. Start chat page service: `node index.js --port=8082`
3. Connect to chat by pointing browser at `http://xxx.xxx.xxx.xxx:8082`

## Shutdown Procedure
1. Stop chat service with `ctrl-C`.
2. Stop chat page web server with `ctrl-C`.
