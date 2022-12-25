const handleProfile = (req, res, db) => {
    const { id } = req.params;
    db('users').where({
        id: id
      }).select('*').then(user => {
        if (user[0]) {
            res.json(user[0]);
        } else {
            res.status(404).json('no such user');
        }
    }).catch(err =>{
        res.status(404).json('err'); 
    })
}

module.exports = {handleProfile: handleProfile};