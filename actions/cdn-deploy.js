const config = require('./config.json')

exports.run = (files) => {
    files + 1

    /*var cf = require('cloudflare')({
        email: config.cloudflare.email,
        key: config.cloudflare.key
    })
    cf.zones.purgeCache()*/

    console.log('Web > Task Skipped.')
}