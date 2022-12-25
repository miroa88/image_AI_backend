const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users')
        .where({id})
        .increment('entries', 1).returning('entries').then(entries => {
            if (entries[0]){
                res.json(entries[0])
            } else {
                res.status(404).json('no such user'); 
            }
        }).catch(err => {
            res.status(404).json('err'); 
    })
}

module.exports = { handleImage:handleImage };