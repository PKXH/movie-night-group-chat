# movie-night-group-chat
Web-based group chat for the movie night crowd ;)

## Installation
1. Install **node.js** (via your favorite package installer)
2. Clone this repo.
3. Open console, `cd` into the repo directory and type `npm init`, following setup defaults.
4. Use `npm install <module>` to install **express**, **socket.io**, **ejs**, and **commander** modules.
5. Unblock port 8082, if firewalled.

(still composing this)
## Run Procedure
1. Start viewer page web server: `sudo webfsd -F -p 8081 -f index.html`
2. Verify reverse proxy server configuration squares: `sudo nginx -t`
3. Start reverse proxy server: `sudo nginx`    
4. Start playing movie file *movie.mp4*: `./reel.sh movie.mp4` 
   **OR** start playing movie file *movie.mp4* on an endless loop: `./loop.sh movie.mp4`

## Shutdown Procedure
1. Stop reverse proxy server: `sudo nginx -s stop`
2. Stop viewer page web server with `ctrl-C`.
