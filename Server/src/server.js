const express = require('express');
const bodyParser = require('body-parser');
const client = require('./database');
const cors = require('cors'); 
const path = require('path');


const app = express();
const port  = process.env.PORT || 3000;

client.connect();

app.use(cors());
app.use(bodyParser.json());

// app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, '../dist/assessment-app')));

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

// All other routes serve the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/assessment-app/index.html'));
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});