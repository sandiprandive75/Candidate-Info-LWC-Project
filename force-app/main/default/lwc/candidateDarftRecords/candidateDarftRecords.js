import { LightningElement,track, wire, api } from 'lwc';
import getApprovalRequests from '@salesforce/apex/CandidateInfoClass.getApprovalRequests';
import DraftModal from 'c/openDraftModal';

export default class CandidateDarftRecords extends LightningElement {
    @track selectedPicklistStatus = 'Draft';
    @track CandidateInfoRequestList;
    CandidateInfoRequestMap = {};
    @track error;
    @track candidateRecordId;

    natigateToCandidateDetails(event){
        this.candidateRecordId = event.target.value;
        console.log('candidate id: '+this.candidateRecordId);
        console.log('candidate map: '+this.CandidateInfoRequestMap);
        let id = event.target.value;
        this.createdById = this.CandidateInfoRequestMap[id].CreatedById;
        console.log('Createdby id: '+this.createdById);

        const result = DraftModal.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            candidateRecordId:this.candidateRecordId, 
            createdById:this.createdById,
        });
        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);
    }
    
    @wire(getApprovalRequests, {approvalStatus:'$selectedPicklistStatus'})
    approvalRequests({error,data}){
        if(data){
            this.CandidateInfoRequestList = data;
            data.forEach(record=>{
                let Id = record.Id;
                this.CandidateInfoRequestMap[Id] = record;
            });
            this.error = undefined;
        }
        else if(error){
            this.CandidateInfoRequestList = undefined;
            this.error = error;
            console.log(error);
        }
    }
}