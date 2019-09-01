const express = require('express')
const app = express()

const crypto = require('crypto')

const execa = require('execa')
const config = require('./config.json')

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
        if (Object.keys(req.body).length === 0) return res.status(400).json({
            success: false,
            reason: 'No Body'
        })

        let body = req.body

        if (!body.head_commit) {
            return res.status(400).json({
                success: false,
                reason: 'Missing head_commit'
            })
        }

        let commit = body.head_commit

        if (commit.message.toLowerCase().startsWith(config.deployPrefix)) {
            (async () => { // eslint-disable-line
                await execa.command(`cd ${config.webdir}`, {shell: true})
                await execa.command('git pull', {shell: true})
            })()

            console.log('Updated at: ' + Date()) 

            return res.status(200).json({
                success: true
            })
        }

        return res.status(200).json({
            success: false,
            reason: 'Not Deploying'
        })
    })
    .delete((req, res, next) => {
        next(new Error('Wrong Type'))
    })

app.use((err, req, res, next) => {
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