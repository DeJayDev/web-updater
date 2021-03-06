const express = require('express')
const app = express()

const crypto = require('crypto')
const config = require('./config.json')

const actions = {
    DEPLOY: require('./actions/deploy.js'),
    CDN: require('./actions/cdn-deploy.js'),
    NOTIFY: require('./actions/notify.js')
}

app.use(express.json())

app.route('/')
    .all((req, res) => {
        res.send('Oh, Hello!')
    }) 

app.route('/update')
    .all((req, res, next) => {
        //Thanks, stigok.
        //https://gist.github.com/stigok/57d075c1cf2a609cb758898c0b202428
        if (!req.body) {
            return next({
                success: false,
                reason: 'No Body'
            })
        }

        const hmac = crypto.createHmac('sha1', config.secret)
        const digest = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex')
        const checksum = req.get('X-Hub-Signature')
        if (!checksum || !digest || checksum != digest) {
            next(new Error(`Request body digest (${digest}) did not match X-Hub-Signature (${checksum})`))
        }

        next()
    })
    .get((req, res) => {
        res.status(400).json({
            success: false,
            reason: 'Wrong Type'
        })
    })
    .put((req, res) => {
        res.status(400).json({
            success: false,
            reason: 'Wrong Type'
        })
    })
    .post((req, res) => {
        actions.DEPLOY.run(req, res)
    })
    .delete((req, res, next) => {
        next(new Error('Wrong Type'))
    })

app.use((err, req, res) => {
    console.error(err.message)
    if (!err.statusCode) err.statusCode = 500
    res.status(err.statusCode).json({
        success: false,
        reason: err.message
    })
})

app.listen(config.port, () => {
    console.log('> Running on port: ' + config.port)
})