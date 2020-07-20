require('dotenv').config();
let express = require('express'),
    router = express.Router(),
    jsonwebtoken = require('jsonwebtoken'),
    crypt = require('./myCryptography');

router.get('/csrf-token', (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});

/* old version
router.post('/jwt', async (req, res) => {
    try {
        const { user } = req.body; 
        const payload = { id: user.id, username: user.username, admin: user.admin, email: user.email};
        const token = jsonwebtoken.sign(payload, process.env.JWTSECRET , {algorithm: 'HS256'}).split('.');
        res.cookie('hp', token[0] + '.' + token[1], {maxAge: 30* 60 * 1000, httpOnly: true, sameSite: "strict"}); // maxAge=30mins, toAdd secure: true
        res.cookie('s', token[2], { httpOnly: true, sameSite: "strict"}); // toAdd secure: true
        res.status(200).json(1);
    } catch (err) {
        console.error(err.messaage);
    }
});
*/

// new version
router.post('/jwt', async (req, res) => {
    try {
        const { user } = req.body; 
        const payload = { id: user.id, username: user.username, admin: user.admin, email: user.email};
        const token = jsonwebtoken.sign(payload, process.env.JWTSECRET , {algorithm: 'HS256'});
        const firstEncodeStep = crypt.littleEncryption(token);
        const encodedToken = crypt.encrypt(firstEncodeStep);
        res.cookie('hps', encodedToken, {maxAge: 30* 60 * 1000, httpOnly: true/*, sameSite: "strict"*/}); // maxAge=30mins, toAdd secure: true
        res.status(200).json(1);
    } catch (err) {
        console.error(err.messaage);
    }
});
/* old version
router.get('/verifyJWT', async (req, res) => {
    try {
        if (req.cookies.hp === undefined ||  req.cookies.s === undefined){
            res.status(200).json({ username: 'Guest', admin: false});
        } else {
            const token = req.cookies.hp + '.' + req.cookies.s;
            const decoded = jsonwebtoken.verify(token, process.env.JWTSECRET)
            res.status(200).json(decoded);
        }
    } catch (err) {
        console.error(err.messaage);
    }
});
*/

//new version
router.get('/verifyJWT', async (req, res) => {
    try {
        if (req.cookies.hps === undefined){
            res.status(200).json({ username: 'Guest', admin: false});
        } else {
            const encodedToken = req.cookies.hps;
            const firstDecodeStep = crypt.decrypt(encodedToken);
            const secondDecodeStep = crypt.littleDecryption(firstDecodeStep);
            const decoded = jsonwebtoken.verify(secondDecodeStep, process.env.JWTSECRET)
            res.status(200).json(decoded);
        }
    } catch (err) {
        console.error(err.messaage);
    }
});

module.exports = router;

/*
// refresh token example

const posts = [
    {
        username: "SATAN",
        title: 'Post1'
    },
    {
        username: "God",
        title: 'Post2'
    }
]

app.get('/posts', authenticateToken ,  (req, res) => {
    res.json(posts.filter(post => post.username === req.user.username));
})

app.post('/login2', (req, res) => {
    const user = { username: req.body.username}

    const accessToken = jsonwebtoken.sign(user, process.env.NEWSECRET)
    res.json({accessToken});
})

function authenticateToken (req, res, next) {
    const authHead = req.headers.authorization;
    const token = authHead && authHead.split(' ')[1]
    if (token === null) return res.sendStatus(401)

    jsonwebtoken.verify(token, process.env.NEWSECRET, (err, user) =>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

//

*/