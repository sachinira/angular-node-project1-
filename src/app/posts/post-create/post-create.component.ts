import { Component, OnInit,EventEmitter,Output, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from'./mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {

  enteredTitle = '';
  enteredContent = '';
  post:Post;
  


  //we have to create the form by an object .a formgroup groups controls in a form and we can create subgroups of a form too
  form:FormGroup;
  imagePreview:string;


  private mode = 'create';
  private postId:string;
  isLoading = false;
  authStatusSub:Subscription;



  //we can listen to the event outside the component  this may be the parent component
  //@Output() postCreated = new EventEmitter<Post>(); this is commented as we use the service to get the posts

  constructor(public service:PostService,public route:ActivatedRoute,private aservice:AuthService) { }

  ngOnInit() {

    this.authStatusSub = this.aservice.getAuthstateListener().subscribe(
      athstatus =>{
        this.isLoading = false;
      });//whenever status is changing set it to false


    //create the form model here
    this.form = new FormGroup({

      title: new FormControl(null,{
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null,{
        validators: [Validators.required]
      }),
      image: new FormControl(null,{
        validators: [Validators.required],
        asyncValidators:[mimeType]//we are not going to bind this into the image inpt field
        //we don't have to synchronize this element with the html form element we can control the image we got inside from the typescript
      })

    });

    //the activated route packsge gives us to identify the current route we are working on. Here from the paramMap
    //an observable is returned the same componet is loaded an the data must be changed according to the id
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        //we have to start the spinner before fetching information
        this.isLoading = true;

        console.log(this.postId);
        
        this.service.getPost(this.postId).subscribe(
          (data)=>{

            //we have to stop the spinner 
            this.isLoading = false;
            this.post = { 
              id: data._id, 
              title: data.title, 
              content: data.content, 
              imagePath:data.imagePath,
              creator:data.creator
            };


            //we can set the values in our form overriding the default in the reactive form 
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
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

  onImageChanged(event:Event){
    const file = (event.target as HTMLInputElement).files[0]; //we sre type converting the file as an htmlinput element beause this tells that this will be html input
    //event tagrget doesn't work

    //from setvalue we set all values of components of the form we can get only one value from the patch method
    this.form.patchValue({image: file}); //we are passing the file object
    this.form.get('image').updateValueAndValidity(); // this says that we have updated this form field and it should be re-evaluated
    console.log(file);
    console.log(this.form);


    //to display the image we have to convert the image that can be displayed in the html
    //we use the file reader to get the url of the file
    const reader = new FileReader();//the file reader is a javascript object


    //what should be done after readig the file
    reader.onload = () =>{
      this.imagePreview = (reader.result as string);
    };

    //after that load that file
    reader.readAsDataURL(file);
  }

  onAddPost(){

    //we can't use a form as an argument now
    if(this.form.invalid){
      return;
    }

    this.isLoading = true;

    if(this.mode === 'create'){
      this.service.createPosts(this.form.value.title,this.form.value.content,this.form.value.image);
    }
    else{
      this.service.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);
    }
   /* const post:Post = {
      title: form.value.title,
      content: form.value.content
    };*/

    //this.postCreated.emit(post);

    //form.resetForm();
    this.form.reset();

    //We ARE GOING TO LOAD THE POST CREAte componnent for two different paths with two differenet demostrations

  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
