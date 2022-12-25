const handleRegister = (req, res , db, bcrypt, saltRounds) => {
    const {email, name, password} = req.body;
    if (!(name && email && password)) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    if (hash) {
        db.transaction(trx => {
            db('login').transacting(trx)
            .insert({
                hash: hash,
                email: email,
            })
            .returning('email')
            .then(loginEmail => {
                db('users').transacting(trx)
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
            }).returning('*').then( user => {
                res.json(user[0]);
            })})
            .then(trx.commit)
            .catch(trx.rollback)
        }).catch(err =>  {
            res.status(400).json(err.detail);
        })
    } else {
        res.status(400).json("error hashing");
    }
}

module.exports = {handleRegister: handleRegister};