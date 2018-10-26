import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  message= 'An unknown error occured!'
  //to retrieve data from the error interceptor we have to innject something
  constructor(@Inject(MAT_DIALOG_DATA)public data: {message:string}) { }  //pass a token to identify the data passed by angular

  ngOnInit() {
  }

}
