import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {

  authStateListenerSub:Subscription;
  isLoading = false;
  constructor(public aservice:AuthService,private router:Router) { }

  ngOnInit() {
    this.authStateListenerSub =  this.aservice.getAuthstateListener().subscribe(
      status =>{
        this.isLoading = false;  //we see if the user is autheticated or not and this is done in authstatuslistner and making it to false ina an error 
      });
  }
//authguard enables the angular router to execute the class before the route

  onSignUp(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.aservice.createUser(form.value.email,form.value.password);
   

  }

  ngOnDestroy(){
    this.authStateListenerSub.unsubscribe();
  }

}
