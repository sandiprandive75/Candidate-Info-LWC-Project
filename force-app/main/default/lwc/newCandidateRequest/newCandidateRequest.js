import { LightningElement, track, wire} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CANDIDATE_INFO_OBJECT from '@salesforce/schema/CandidateInfo__c';
import STATE from '@salesforce/schema/CandidateInfo__c.State__c';
import COUNTRY from '@salesforce/schema/CandidateInfo__c.Country__c';
import CITY from '@salesforce/schema/CandidateInfo__c.City__c';
import ZIP_CODE from '@salesforce/schema/CandidateInfo__c.Zip_Code__c';
import EMAIL_FIELD from '@salesforce/schema/CandidateInfo__c.Email__c';
import PHONE_FIELD from '@salesforce/schema/CandidateInfo__c.Phone__c';
import SALUTATION_FIELD from '@salesforce/schema/CandidateInfo__c.Salutation__c';
import FIRSTNAME_FIELD from '@salesforce/schema/CandidateInfo__c.First_Name__c';
import MIDDLENAME_FIELD from '@salesforce/schema/CandidateInfo__c.Middle_Name__c';
import LASTNAME_FIELD from '@salesforce/schema/CandidateInfo__c.Last_Name__c';
import GENDER_FIELD from '@salesforce/schema/CandidateInfo__c.Gender__c';
import createCandidateInfo from '@salesforce/apex/CandidateInfoClass.createCandidateInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewCandidateRequest extends LightningElement {
    @track state= STATE;
    @track country= COUNTRY;
    @track city= CITY;
    @track zipCode= ZIP_CODE;
    @track email= EMAIL_FIELD;
    @track phone= PHONE_FIELD;
    @track salutation= SALUTATION_FIELD;
    @track firstName= FIRSTNAME_FIELD;
    @track middleName= MIDDLENAME_FIELD;
    @track lastName= LASTNAME_FIELD;
    @track gender= GENDER_FIELD;
    
    @track errorMessage;

    @track rec = {
        Country__c  : this.country,
        State__c : this.state,
        City__c  : this.city,
        Zip_Code__c  : this.zipCode,
        Email__c  : this.email,
        Phone__c  : this.phone,
        Salutation__c  : this.salutation,
        First_Name__c  : this.firstName,
        Middle_Name__c  : this.middleName,
        Last_Name__c  : this.lastName,
        Gender__c  : this.gender
    }


    handleChange(event) {
        if(event.target.label == 'First Name'){
            this.rec.First_Name__c = event.target.value;
        }else if(event.target.label == 'Middle Name'){
            this.rec.Middle_Name__c = event.target.value;
        }else if(event.target.label == 'Last Name'){
            this.rec.Last_Name__c = event.target.value;
        }else if(event.target.label == 'Gender'){
            this.rec.Gender__c = event.target.value;
        }else if(event.target.label == 'Phone'){
            this.rec.Phone__c = event.target.value;
        }else if(event.target.label == 'Email'){
            this.rec.Email__c = event.target.value;
        }else if(event.target.label == 'City'){
            this.rec.City__c = event.target.value;
        }else if(event.target.label == 'Country'){
            this.rec.Country__c = event.target.value;
        }else if(event.target.label == 'State'){
            this.rec.State__c = event.target.value;
        }else if(event.target.label == 'Zip Code'){
            this.rec.Zip_Code__c = event.target.value;
        }else if(event.target.label == 'Salutation'){
            this.rec.Salutation__c = event.target.value;
        }
    }
    
    handleClick() {
        // console.log("Record Set", this.rec);
        console.log("Number 1");
        createCandidateInfo({ cadInfoRec : this.rec })
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.rec.Country__c = '';
                    this.rec.City__c = '';
                    this.rec.Zip_Code__c = '';
                    this.rec.Email__c = '';
                    this.rec.Phone__c = '';
                    this.rec.Salutation__c = '';
                    this.rec.First_Name__c = '';
                    this.rec.Middle_Name__c = '';
                    this.rec.Last_Name__c = '';
                    this.rec.Gender__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Candidate Info Saved!',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.errorMessage = error.body.message;
            });
    }
}