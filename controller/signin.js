const handleSignin = (req, res , db, bcrypt) => {
    db.transaction(trx => {
        db('login').transacting(trx)
        .select('*').where({email: req.body.email })
        .then(loginUser => {
            if (bcrypt.compareSync(req.body.password, loginUser[0].hash) &&
                req.body.email === loginUser[0].email){
                    db('users').transacting(trx)
                    .select('*').where({ email: loginUser[0].email })
                    .then( user => {
                        res.json(user[0]);
                    })
            } else {
                res.status(400).json('Wrong Password')
            }
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err =>  {
        res.status(400).json('error logging in: user does not exist.');
    })
}

module.exports = {handleSignin: handleSignin};