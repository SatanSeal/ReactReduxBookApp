require('dotenv').config();
let express = require('express'),
    router = express.Router(),
    jsonwebtoken = require('jsonwebtoken'),
    crypt = require('./myCryptography');

router.get('/csrf-token', (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});

router.post('/jwt', async (req, res) => {
    try {
        const { user } = req.body; 
        const payload = { id: user.id, username: user.username, admin: user.admin, email: user.email};
        const token = jsonwebtoken.sign(payload, process.env.JWTSECRET , {algorithm: 'HS256'});
        const firstEncodeStep = crypt.littleEncryption(token);
        const encodedToken = crypt.encrypt(firstEncodeStep);
        res.cookie('hps', encodedToken, {maxAge: 1000 * 60 * 60 * 2 , httpOnly: true, sameSite: "strict"}); // maxAge=2hours, toAdd secure: true
        res.status(200).json(1);
    } catch (err) {
        console.error(err.messaage);
    }
});

router.get('/verifyJWT', async (req, res) => {
    try {
        if (req.cookies.hps === undefined){
            res.status(200).json(0);
        } else {
            const encodedToken = req.cookies.hps;
            const firstDecodeStep = crypt.decrypt(encodedToken);
            const secondDecodeStep = crypt.littleDecryption(firstDecodeStep);
            try {
                const decoded = jsonwebtoken.verify(secondDecodeStep, process.env.JWTSECRET);
                res.cookie('hps', encodedToken, {maxAge: 1000 * 60 * 60 * 2 , httpOnly: true, sameSite: "strict"})
                res.status(200).json(decoded);
            } catch {
                res.cookie('hps', null, { maxAge: -1 });
                res.status(200).json(1);
            }

        }
    } catch (err) {
        console.error(err.messaage);
    }
});

module.exports = router;
