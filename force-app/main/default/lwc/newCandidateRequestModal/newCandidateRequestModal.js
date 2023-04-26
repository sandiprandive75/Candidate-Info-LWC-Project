import { LightningElement, api, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import submitAndProcessApprovalRequest from '@salesforce/apex/CandidateApprovalProcess.submitAndProcessApprovalRequest'; 

export default class NewCandidateRequestModal extends LightningModal {
    @api content;
    @track showModal=false;
    @track candidateInfoId;
    @track createdById;
    @track currentStepTittle = 'Candidate Info';
    @track approvalMsg;
    @track approvalErrorMsg;
    @track currentPage = 1;
    @track disablePrevious = true;
    @track disableNext = true;
    @track showSpinner=false;
    @track currentStep = {
        'Step_1':true,
        'Step_2':false,
        'Step_3':false,
    };

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

    handleCandidateId(event){
        console.log('In handle candidate');
        this.candidateInfoId = event.detail.recordId;
        this.createdById = event.detail.createdById;
        this.disableNext = false;
    }

    submitForApproval(){
        this.showSpinner = true;
        submitAndProcessApprovalRequest({candidateInfoId:this.candidateInfoId, createdById:this.createdById})
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