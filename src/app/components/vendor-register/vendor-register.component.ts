import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators,FormBuilder} from '@angular/forms';
import {RegisterService} from '../../services/register.service';

@Component({
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.css'],
  providers:[ RegisterService ]
})
export class VendorRegisterComponent implements OnInit {
  fb: FormBuilder;
  form:FormGroup;

  constructor(
    @Inject(FormBuilder)  fb: FormBuilder,
    private registerService:RegisterService,
  ) {
    this.fb=fb;
  }

  ngOnInit() {
    this.form=new FormGroup({
      firstName : new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
      lastName : new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('',Validators.required),
      contact : new FormControl('', [Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(11)]),
      DOB : new FormControl(''),
      gender : new FormControl(''),
      address : new FormControl(''),
      city : new FormControl('',Validators.pattern('[a-zA-Z][a-zA-Z]+')),
      state : new FormControl('',Validators.pattern('[a-zA-Z][a-zA-Z]+')),
      zip : new FormControl('', [Validators.pattern('[0-9]*')]),
      vendorAddress : new FormControl('', [Validators.required]),
      vendorCity : new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
      vendorState : new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z]+')]),
      vendorZip : new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      vendorContact : new FormControl('', [Validators.required, Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(11)])
    });
  }

  registerVendor(){
    let tempPassword="";

    tempPassword=this.form.get('password').value;
    var xorKey = 129;
    var resultPassword = "";

    for (let i = 0; i < tempPassword.length; i++) {
      resultPassword += String.fromCharCode(xorKey ^ tempPassword.charCodeAt(i));
    }

    let body={
      "address": {
        "city": this.form.get('city').value,
        "state": this.form.get('state').value,
        "street": this.form.get('address').value,
        "zipCode": this.form.get('zip').value
      },
      "dob": this.form.get('DOB').value,
      "email": this.form.get('email').value,
      "firstName": this.form.get('firstName').value,
      "gender":    this.form.get('gender').value,
      "lastName":  this.form.get('lastName').value,
      "mobileNo":  this.form.get('contact').value,
      "password":  resultPassword,
      "role":      "vendor",
      "shopAddress": {
        "city": this.form.get('vendorCity').value,
        "state": this.form.get('vendorState').value,
        "street": this.form.get('vendorAddress').value,
        "zipCode": this.form.get('vendorZip').value
      },
      "vendorMobileNo": this.form.get('vendorContact').value
    };
    console.log(this.form.value);

    this.registerService.register(body).subscribe((res) =>{
      alert("Registered");
    }, (res:Response) =>{
      console.log(res);
      if(res.status==401 || res.status==409){
        alert("Username already exists");
      }
      else if(res.status==500){
        alert("Internal server error");
      }
      else if(res.status==201){
        alert("Successfully registered");
      }
      else if(res.status==404){
        alert("Service Not Found");
      }
      else if(res.status==403){
        alert("403 Forbidden");
      }
      else{
        alert("Connection error");

      }
    });

  }

}