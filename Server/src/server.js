const express = require('express');
const bodyParser = require('body-parser');
const client = require('./database');
const cors = require('cors'); 

const app = express();
const port  = process.env.PORT || 3000;

client.connect();

app.use(cors());
app.use(bodyParser.json());

// app.get('/', (req, res)=>{
//     console.log("You are connected to the server");
//     console.log("Error");
//     res.send("You are connected to the server");
// });

app.get('/api/student-grades', (req, res)=>{
    client.query('SELECT * FROM students', (err, result)=>{
        if(err){
            console.error('Error fetching data from database:', err);
            res.status(500).json({error: 'Error fetching data'});
        } else {
            res.json(result.rows);
        }
    });
});

app.post('/api/student', (req, res)=>{
    const studentData = req.body;
    client.query('INSERT INTO students (name, grade) VALUES ($1, $2)', [studentData.name, studentData.grade], (err, result)=>{
        if(err){
            console.log('Error inserting data into database:', err);
            res.status(500).json({error: 'Error inserting data'});
        }
        else {
            res.json({message: 'Data recieved and saved successfully.'})
        }
    })
})
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});