import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import {HttpClient} from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {

  public name : string="";
  public questions : any = [];
  public thisQuestion : number = 0;
  public points : number = 0;
  public correctAns : number = 0;
  public inCorrectAns : number = 0;
  isCompleted: boolean =false;
  counter = 60;
  interval$:any;
  public progress : string="0";
  public std_name:any;
  public grds: any;
  constructor (private questionService : QuestionService, private http : HttpClient) {}

  ngOnInit(): void{
    this.name = localStorage.getItem("name")!;
    this.getAssessmentQuestions();
    this.startTimer();
  }

  getAssessmentQuestions(){
    this.questionService.getJsonQuestions()
     .subscribe(res=>{
      // console.log(res.questions);
      this.questions = res.questions;
     })
  }

  nextQuestion(){
    this.thisQuestion++;
  }

  prevQuestion(){
    this.thisQuestion--;
  }
  sendData(std_name:any, grds: any){
    const studentData = {
      name: std_name,
      grade: grds
    };

    this.http.post('http://localhost:3000/api/student', studentData)
      .subscribe(
        (response) => {
          console.log('Data sent successfully:', response);
        },
        (error) => {
          console.error('Error sending data:', error);
        }
      );

    this.http.post('http://localhost:3000/api/send-to-moodle', studentData)
        .subscribe(
          (response1) =>{
            console.log('Data sent successfully:', response1);
          },
          (error) =>{
            console.error('Error sending data:', error);
          }
        );
  }
  
  checkAnswer(currQuestion:number, option:any){
    if(currQuestion === this.questions.length){
      this.isCompleted = true;
      this.stopTimer();
      this.sendData(this.name, this.points)
      console.log(this.name, this.points);
      
    }
    if(option.correct){
      this.points+=10;
      this.correctAns++;
      setTimeout(()=>{
        this.thisQuestion++;
        this.getProgressPercent();
        this.resetTimer();
      }, 1000)
    } else{
      setTimeout(()=>{
        this.thisQuestion++;
        this.inCorrectAns++;
        this.resetTimer();
        this.getProgressPercent();
      }, 1000)
    }
  }

  startTimer(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter === 0){
        this.thisQuestion++;
        this.counter = 60;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    }, 6000000);
  }

  stopTimer(){
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetTimer(){
    this.stopTimer();
    this.counter = 60;
    this.startTimer();
  }

  resetAssessment(){
    this.resetTimer();
    this.getAssessmentQuestions();
    this.points=0;
    this.counter=60;
    this.thisQuestion = 0;
    this.progress = "0";
  }

  getProgressPercent(){
    this.progress = ((this.thisQuestion/this.questions.length)*100).toString();
    return this.progress;
  }
  

}

