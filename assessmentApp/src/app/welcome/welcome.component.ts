import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent{
  @ViewChild('student_name') nameKey!: ElementRef;
  constructor (){ }

  startAssessment(){
    console.log("student_name", this.nameKey.nativeElement.value)
    localStorage.setItem("name", this.nameKey.nativeElement.value);
  }
 
}
