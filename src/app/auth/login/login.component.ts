import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  isLoading = false;
  authStateListenerSub:Subscription;

  constructor(public aservice: AuthService) { }

  ngOnInit() {
    this.authStateListenerSub =  this.aservice.getAuthstateListener().subscribe(
      status =>{
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm){

    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.aservice.loginUser(form.value.email,form.value.password);
    
  }

  ngOnDestroy(){
    this.authStateListenerSub.unsubscribe();
  }


}
