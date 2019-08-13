# discord-bot
Discord bot for my server

## Commands
All commands are prefixed with '!' (Configurable through config.json).<br/>
Please keep in mind some (most?) of the commands are rather silly, and are built to suit the 'needs/wants' of one specific discord server.
<br/>
![Screenshot showing current commands.](https://i.imgur.com/L1n2IUV.png)
<br/>
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

