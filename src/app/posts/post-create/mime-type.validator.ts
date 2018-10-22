import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

//we are going to create a validator
//this validator will be an asynchronous validator where readiing the file also be a asynchronous task
// to not to block the javascript code as this is a asynchronous validator we have to create a special return type 
//where for synchronous validators return javascript  objcet with  key value pair error code and value for error code if validoatror is null the value is treated valid
//asynchrnous validator has a promise or observables



//as promise and observable are both generic types we can clearly ay what they will eentually return
//we use the square brackets to say that we could hav any property witha any name
export const mimeType = (control:AbstractControl): Promise<{[key:string]:any}> | Observable<{[key:string]:any}> =>{


    //we can access the file by using  control value
    const file = control.value as File;
    const reader  = new FileReader();

    //as reader.onlad don't return any observable we can create our own observable
    const frObs = Observable.create((observer:Observer<{[key:string]:any}>)=>{


        //w create this logic to get rid of form image file detected being not a file but a string
        if(typeof(control.value)=== 'string'){
            return of(null); //we immediately want to return an observable retrn that this is valid

        }
    
        //this is equivalent to filereader.onloadend
        //difference between load and loadend is loadend has more information about the laoded file
        reader.addEventListener('loadend',()=>{

            const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0,4);//creates an unsighned integer array of 8bits
            //this is used as we can upload pdf files by changing the filetypeas pdf but by looking into the file 
            //and checking if really that file is a pdf / jpg
            //in the array the following subarray gives the mimetype of the file

            //to  get  the filetypr we have to radin a pattern
            let header = "";
            let isValid = false;
            for(let i=0;i<arr.length;i++){
                header += arr[i].toString(16);
                //convert this string to hexadecimal string
                //we have a string has a crealy defined pattern for each file

            }

            switch(header){
                case "89504e47":
                isValid = true;
                break;

                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                isValid = true;
                break;

                default:
                isValid = false;
                break;

                //thses are patterns stands for different filetypes we cand search as javascript file mimetypes to get more details
            }

            //then we use the observer to emit data
            if(isValid){
                observer.next(null);
            }else{
                observer.next({invalidType: true});
            }
            observer.complete();
        });

        //used to start reading the contents of a specified Blob or File.
        reader.readAsArrayBuffer(file); //this allow us to access the mimetype
    });

    return frObs;

};
