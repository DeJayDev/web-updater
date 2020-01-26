const config = require('../config.json')
const execa = require('execa')

exports.run = (req, res) => {
    let body = req.body

    if (!body.head_commit) {
        return res.status(400).json({
            success: false,
            reason: 'Missing head_commit (Bad payload?)'
        })
    }

    let commit = body.head_commit

    if (commit.message.toLowerCase().startsWith(config.deployPrefix)) {
        let response = execa.commandSync(`git -C ${config.webdir} pull`, {
            shell: true
        })

        console.log('Web > Response at ' + Date() + ': ')
        console.log('Git > ' + response.stdout)

        return res.status(200).json({
            success: false,
            reason: 'Already up to date.'
        })
    }

    return res.status(200).json({
        success: false,
        reason: 'Not Deploying'
    })
}