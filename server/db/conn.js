const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

var _db;

module.exports = {
    connectToServer: (callback) => {
        client.connect((err, db) => {
            if (db) {
                _db = db.db("users")
                console.log('Successfully connected to database')
            }

            return callback(err)
        })
    },
    getDb: () => {
        return _db
    }
}