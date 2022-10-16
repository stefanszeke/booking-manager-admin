import { Injectable } from '@angular/core';

import { FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class ValidatorService {

  constructor() { }

  isEmailValid(control: FormControl): Promise<any> {
    
    function checkEmail (email: string): boolean {
      const emailRegex = new RegExp("^[\\w._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
      return emailRegex.test(email);
    }

    const response = new Promise((resolve, reject) => { setTimeout(() => {

        if (checkEmail(control.value)) {
          resolve(null);
        } else {
          resolve({ 'invalidEmail': true });
        }

      }, 500);
    })
    return response;
  }

  isPhoneNumberValid(control: FormControl): Promise<any> {

    function checkPhoneNumber (phoneNumber: string): boolean {
      const phoneNumberRegex = new RegExp("[^0-9\\s+]", "g");
      return !phoneNumberRegex.test(phoneNumber);
    }

    function checkPhoneNumberLength (phoneNumber: string): boolean {
      const matchNumbersRegex = new RegExp("[0-9]", "g");
      return phoneNumber.match(matchNumbersRegex)!.length > 7;
    }

    const response = new Promise((resolve, reject) => { setTimeout(() => {

        if (checkPhoneNumber(control.value) && checkPhoneNumberLength(control.value)) {
          resolve(null);
        } else if (!checkPhoneNumber(control.value)) {
          resolve({ 'invalidPhoneNumber': true });
        } else if (!checkPhoneNumberLength(control.value)) {
          resolve({ 'invalidPhoneNumberLength': true });
        }

      }, 500);
    })
    return response;
  }


}