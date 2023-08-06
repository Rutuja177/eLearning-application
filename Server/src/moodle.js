const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/send-to-moodle', (req, res)=>{
    const studentData = req.body;

    const moodlePayload ={
        wstoken: '5fce23be30fd64932217b86644cc7447',
        wsfunction: 'gradingform_guide_grader_gradingpanel_store',
        moodlewsrestformat: 'json',
        //courseid: studentData.courseId, // Replace with actual Moodle course ID
        //attemptid: studentData.attemptId, // Replace with actual attempt ID
        userid: studentData.name, // Replace with actual Moodle user ID
        grade: studentData.grade, // Replace with actual grade
    }
    axios.post('http://34.174.74.240/webservice/rest/server.php', moodlePayload)
    .then((response) => {
      console.log('Grade data sent to Moodle:', response.data);
      res.status(200).json({ message: 'Grade data sent to Moodle successfully' });
    })
    .catch((error) => {
      console.error('Error sending grade data to Moodle:', error);
      res.status(500).json({ error: 'Error sending grade data to Moodle' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

