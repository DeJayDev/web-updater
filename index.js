const express = require('express')
const app = express()

const execa = require('execa')
const config = require('./config.json')

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Oh, Hello!')
})

app.route('/update')
    .all((req, res, next) => {
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
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                reason: 'No Body'
            })
        }
        let body = req.body
        let userAgent = req.get('User-Agent')

        if (!userAgent.startsWith('GitHub-Hookshot/')) {
            return res.status(400).json({
                success: false,
                reason: 'Invalid Header'
            })
        }

        if (!body.head_commit) {
            return res.status(400).json({
                success: false,
                reason: 'Missing head_commit'
            })
        }
        let commit = body.head_commit

        if (commit.message.toLowerCase().startsWith(config.deployPrefix)) {            
            (async () => { // eslint-disable-line
                await execa.command('git pull')
            })()

            return res.status(200).json({
                success: true
            })
        }

        return res.status(200).json({
            success: false,
            reason: 'Skipping deploy.'
        })
    })
    .delete((req, res, next) => {
        next(new Error('Wrong Type'))
    })

app.listen(config.port, () => {
    console.log('> Running on port: ' + config.port)
})