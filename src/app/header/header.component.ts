import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  public userIsAuthenticated = false;
  private authListenerSub:Subscription;

  constructor(public service:AuthService) { }

  ngOnInit() {


    this.userIsAuthenticated = this.service.getIsAuth();
    this.authListenerSub =  this.service.getAuthstateListener().subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
    //we have to do somthing in the subscription
  }

  onLogOut(){
    this.service.logOutUser();
  }

  ngOnDestroy(){
    //te observables managed by us must be unsubscribed at the destuction of the componenet
    this.authListenerSub.unsubscribe();

  }

}
