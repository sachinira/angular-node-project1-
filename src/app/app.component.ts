import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'myproject';

  constructor(private aservice:AuthService){}

  ngOnInit(){
   this.aservice.autoAuthUser();
  }

  /*postsSaved:Post[] = [];

  onPostAdded(post){
    this.postsSaved.push(post);
  }*/
}
