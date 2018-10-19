import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{

  //@Input() posts:Post[] = [];
  posts:Post[] = [];

  private postSub:Subscription;

  constructor(public service:PostService) { }

  ngOnInit() {
    this.service.getPosts();

    this.postSub =  this.service.getPostUpdateListener().subscribe(
      (data:Post[])=>{
        this.posts = data;
      }
    );
  }


  deletePost(id:string){
    this.service.deletePost(id);
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();

    //remove subscription and remove memory leaks
  }

  //can input only from the parent component
  /*posts = [
    { title:'mypost 1',content:'This is the first post'},
    { title:'mypost 2',content:'This is the second post'},
    { title:'mypost 3',content:'This is the third post'},

  ]*/

}
