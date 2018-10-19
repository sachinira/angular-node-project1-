import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';
  post:Post;
  private mode = 'create';
  private postId:string;
  

  //we can listen to the event outside the component  this may be the parent component
  //@Output() postCreated = new EventEmitter<Post>(); this is commented as we use the service to get the posts

  constructor(public service:PostService,public route:ActivatedRoute) { }

  ngOnInit() {
    //the activated route packsge gives us to identify the current route we are working on. Here from the paramMap
    //an observable is returned the same componet is loaded an the data must be changed according to the id
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        console.log(this.postId);
        
        this.service.getPost(this.postId).subscribe(
          (data)=>{
            this.post = { id: data._id, title: data.title, content: data.content};
          });
        //then we have to load this post to our frontend form

      }
      else{
        this.mode = 'create';
        this.postId = null; 
        //we have to fetch information about the editing when we're editing it . we can get it from the service and also from the 
        //backend too. we're going to get the information from the service
      }
    });
  }

  onAddPost(form:NgForm){

    if(form.invalid){
      return;
    }

    if(this.mode === 'create'){
      this.service.createPosts(form.value.title,form.value.content);
    }
    else{
      this.service.updatePost(this.postId,form.value.title,form.value.content);
    }
   /* const post:Post = {
      title: form.value.title,
      content: form.value.content
    };*/

    //this.postCreated.emit(post);

    form.resetForm();

    //We ARE GOING TO LOAD THE POST CREAte componnent for two different paths with two differenet demostrations

  }

}
