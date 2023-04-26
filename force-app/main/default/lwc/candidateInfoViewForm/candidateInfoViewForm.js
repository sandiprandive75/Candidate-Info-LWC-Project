import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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

export default class CandidateInfoViewForm extends LightningElement {
    @track candidateInfoId;
    @track showSpinner=false;

    candidateObjRef = CANDIDATE_INFO_OBJECT;

    fields = [
        SALUTATION_FIELD,
        FIRSTNAME_FIELD,
        MIDDLENAME_FIELD,
        LASTNAME_FIELD,
        GENDER_FIELD,
        EMAIL_FIELD,
        PHONE_FIELD,
        COUNTRY,
        STATE, 
        CITY,
        ZIP_CODE        
    ]

    handleSubmit(){
        this.showSpinner = true;
    }
    
    handleSuccess(event){
        this.showSpinner = false;
        console.log('In candidate view form at start');
        this.template.querySelector('c-custom-toast').showToast('success', 'Saved Candidate Record Successfully!');
        this.candidateInfoId = event.detail.id;
        let candidateUserId = event.detail.fields.CreatedById.value;
        console.log('In candidate view form:'+candidateUserId);
        const passEvent = new CustomEvent('candidateinforecordcreation', {
            detail:{
                    recordId:this.candidateInfoId, 
                    createdById:candidateUserId,
                    showSpinner:this.showSpinner
                }
        });
        this.dispatchEvent(passEvent);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Candidate Info Saved!',
                variant: 'success',
            }),
            );
    }

    handleError(){
        this.template.querySelector('c-custom-toast').showToast('error', 'This is a Error Message.');
        this.showSpinner = false;
    }

    handleUpdate(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Candidate Info record updated!',
                variant: 'success',
            }),
            );
    }
}