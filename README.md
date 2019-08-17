# Web Updater

There's a repo on this account simply titled web. It's how I maintain my website from multiple device, but I got tired of zipping the whole project and uploading it and then unzipping... 

This fixes that.

Ths little things waits for a [GitHub Webhook](https://developer.github.com/webhooks/), verifies it's real and good and then runs `git pull` in the working directory of the web server. (See `config.example.json`)

Ezpz right? Cool.

## How do I use it?

Edit `config.example.json` then rename it to `config.json`, whenever you start a commit with `deploy: ` this script will do it's thing.

I recommend running this script under a process manager such as [pm2](https://github.com/Unitech/pm2).

## Why is this open source?
Why not lol. My public projects are lacking, so why not make one of my utilities public? 

Given some motiviation, I might also publicize the actual website's source.  