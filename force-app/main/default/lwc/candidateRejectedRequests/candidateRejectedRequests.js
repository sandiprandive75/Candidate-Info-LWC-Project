import { LightningElement, track, wire } from 'lwc';
import getApprovalRequests from '@salesforce/apex/CandidateInfoClass.getApprovalRequests';
import { NavigationMixin } from 'lightning/navigation';

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

export default class CandidateRejectedRequests extends LightningElement {
    @track selectedPicklistStatus = 'Reject';
    @track CandidateInfoRequestList;
    @track error;
    @track recordId;

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
    
    @wire(getApprovalRequests, {approvalStatus:'$selectedPicklistStatus'})
    approvalRequests({error,data}){
        if(data){
            this.CandidateInfoRequestList = data;
            this.error = undefined;
        }
        else if(error){
            this.CandidateInfoRequestList = undefined;
            this.error = error;
            console.log(error);
        }
    }

    handlePrevious(){
        this.recordId = '';
    }

    natigateToCandidateDetails(event){
        this.recordId = event.target.value;
        console.log('candidate id: '+this.recordId);
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__recordPage',
        //     attributes: {
        //         recordId: this.recordId,
        //         objectApiName: 'CandidateInfo__c',
        //         actionName: 'view'
        //     },
        // });
    }
}