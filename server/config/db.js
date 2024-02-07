/*  /server/config/db.js  */
const mongoose = require('mongoose')
const connect_db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Database connected: ${conn.connection.host}`)
  }
  catch (e) { console.log(e); }
}
module.exports = connect_db