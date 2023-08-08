const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    //host: "amesite-assessment-rutuja:us-south1:studentgrades",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "student_grades"

})
client.on("connect", ()=>{
    console.log("Connected to the database");
})
client.on("end", ()=>{
    console.log("Connection ends");
})

module.exports = client;