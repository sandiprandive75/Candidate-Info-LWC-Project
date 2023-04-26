import { LightningElement, api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import submitAndProcessApprovalRequest from '@salesforce/apex/CandidateApprovalProcess.submitAndProcessApprovalRequest';
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

export default class OpenDraftModal extends LightningModal {
    @track showModal=false;
    @api candidateRecordId;
    @api createdById;
    @track currentStepTittle = 'Candidate Info';
    @track approvalMsg;
    @track approvalErrorMsg;
    @track currentPage = 1;
    @track disablePrevious = true;
    @track disableNext = false;
    @track showSpinner=false;
    @track currentStep = {
        'Step_1':true,
        'Step_2':false,
        'Step_3':false,
    };

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

    handleNext(){
        if(this.currentPage < 3){
            this.currentPage++;
            this.loadCurrentPage();
        }else{
            this.disableNext = true; 
        }
    }
    
    handlePrevious(){
        if(this.currentPage > 1){
            this.currentPage--;
            this.loadCurrentPage();
        }else{
            this.disablePrevious = true;
        }
    }

    loadCurrentPage(){
        if(this.currentPage == 1){
            this.currentStep.Step_1=true;
            this.currentStep.Step_2=false;
            this.currentStep.Step_3=false;
            this.currentStepTittle = 'Candidate Info';
            this.disablePrevious = true;
            this.disableNext = false;
        }
        else if(this.currentPage == 2){
            this.currentStep.Step_1=false;
            this.currentStep.Step_2=true;
            this.currentStep.Step_3=false;
            this.currentStepTittle = 'Candidate Spouse & Children Details';
            this.disablePrevious = false;
            this.disableNext = false;
        }
        else if(this.currentPage == 3){
            this.currentStep.Step_1=false;
            this.currentStep.Step_2=false;
            this.currentStep.Step_3=true;
            this.currentStepTittle = 'Submit for approval';
            this.disablePrevious = false;
            this.disableNext = true;        
        }
    }

    submitForApproval(){
        this.showSpinner = true;
        submitAndProcessApprovalRequest({candidateInfoId:this.candidateRecordId, createdById:this.createdById})
        .then(result => {
            this.approvalMsg = 'Your request for approval has been submitted successfully!'
            this.approvalErrorMsg = '';
            console.log('Approval result:'+result);
        })
        .catch(error => {
            this.approvalErrorMsg = error.body.message
            console.log('Approval Error:'+error.body.message);
        });

        this.showSpinner = false;
    }

    handleOkay(){
        this.close('okay');
    }

    handleModal(){
        this.showModal=true;
    }
}