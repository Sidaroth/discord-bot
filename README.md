# discord-bot
Discord bot for my server

## Commands
All commands are prefixed with '!'.<br/>
Highlighted commands:
* armory --> Wow armory character lookup.
* kitsu --> anime lookup
* cat --> random cat image/gif
* dog --> random dog image/gif
* xkcd --> random or specific xkcd lookup

For a list of all commands see the 'src/commands/' directory.<br/>
For a list of planned commands, see issues.  

## To run
to run with node and npm (dev):
```
git clone 'repository url'
cd 'repository dir'
npm install
npm start
```
To run with pm2:<br/>
`pm2 start --interpreter babel-node index.js --name "Discord Bot" --watch`

## Contribute
Pull requests with new commands, or improvements to old commands are welcome.<br/>
New issues related to wanted features is also welcome.

