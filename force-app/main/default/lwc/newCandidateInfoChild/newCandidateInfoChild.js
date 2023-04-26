import { LightningElement, wire, track, api } from 'lwc';
import getCandidateChildInfoList from '@salesforce/apex/CandidateInfoChildController.getCandidateChildInfoList';
import createCandidateChildInfo from '@salesforce/apex/CandidateInfoChildController.insertCandidateChildInfo';
import updateCandidateChildInfo from '@salesforce/apex/CandidateInfoChildController.updateCandidateChildInfo';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { deleteRecord } from 'lightning/uiRecordApi';

import SALUTATION_FIELD from '@salesforce/schema/CandidateInfoChildren__c.Salutation__c';
import GENDER_FIELD from '@salesforce/schema/CandidateInfoChildren__c.Gender__c';
import CITY_FIELD from '@salesforce/schema/CandidateInfoChildren__c.City__c';
import STATE_FIELD from '@salesforce/schema/CandidateInfoChildren__c.State__c';
import COUNTRY_FIELD from '@salesforce/schema/CandidateInfoChildren__c.Country__c';
import ID_FIELD from '@salesforce/schema/CandidateInfoChildren__c.Id';
import RELATION_FIELD from '@salesforce/schema/CandidateInfoChildren__c.Relation__c';
import CANDInfoChild_OBJECT from '@salesforce/schema/CandidateInfoChildren__c';

export default class NewCandidateInfoChild extends LightningElement {
    @api candidateInfoId;
    @track CandidateChildList;
    @track error;
    @track errorMessage;

    // connectedCallback(){
    //   getCandidateChildInfoList()
    //     .then(result => {
    //         this.CandidateChildList = result;
    //     })
    //     .catch(error => {
    //         this.error = error;
    //         console.log(error);
    //     });
    // }

    // @wire(getCandidateAddressInfoList)
    // CandidateAddressInfoList;

    @track tableData = [
            { 'Id':'',
            'dataIndex': 1,
            'Salutation__c' : '',
            'First_Name__c' : '',
            'Middle_Name__c' : '',
            'Last_Name__c' : '',
            'Gender__c' : '',
            'Email__c' : '',
            'Phone__c' : '',
            'Relation__c' : '',
            'City__c': '', 
            'State__c': '', 
            'Country__c': '', 
            'Zip_Code__c': '', 
            'rowEditable':true,
            'updated':false }
    ];

    handleEditClick(event) {
      const index = event.target.dataset.index;
      this.tableData[index].rowEditable = true;
      this.tempCandAdd.updated = this.tableData[index].updated;
      this.tempCandAdd.Id = this.tableData[index].Id;
    }
    
    idCounter = 1;

    //get object metadata for fetching picklist values
    @wire(getObjectInfo, { objectApiName: CANDInfoChild_OBJECT })
    candidateChildMetadata;

    // now get the picklist values
    salutationPicklist='';
    genderPicklist='';
    @track stateFieldData;
    @track cityFieldData;
    cityPicklist='';
    statePicklist='';
    countryPicklist='';
    relationPicklist='';

    //fatch picklist values
    @wire(getPicklistValues,{recordTypeId: '$candidateChildMetadata.data.defaultRecordTypeId',fieldApiName: SALUTATION_FIELD })
    setSalutationPicklistOptions({error, data}) {
      if (data) {
          this.salutationPicklist = data.values;
          console.log(this.salutationPicklist);
        }
      }
    
    @wire(getPicklistValues,{recordTypeId: '$candidateChildMetadata.data.defaultRecordTypeId',fieldApiName: RELATION_FIELD })
    setRelationPicklistOptions({error, data}) {
      if (data) {
          this.relationPicklist = data.values;
          console.log('Relation Picklist:'+this.relationPicklist)
        }
      }

    @wire(getPicklistValues,{recordTypeId: '$candidateChildMetadata.data.defaultRecordTypeId',fieldApiName: GENDER_FIELD })
    setGenderPicklistOptions({error, data}) {
    if (data) {
        this.genderPicklist = data.values;
        }
    }

    @wire(getPicklistValues,{recordTypeId: '$candidateChildMetadata.data.defaultRecordTypeId',fieldApiName: COUNTRY_FIELD })
    setCountryPicklistOptions({error, data}) {
    if (data) {
        this.countryPicklist = data.values;
      }
    }

    @wire(getPicklistValues,{recordTypeId: '$candidateChildMetadata.data.defaultRecordTypeId',fieldApiName: STATE_FIELD })
    setStatePicklistOptions({error, data}) {
      if (data) {
          this.stateFieldData = data;
        }
      }

    @wire(getPicklistValues,{recordTypeId: '$candidateChildMetadata.data.defaultRecordTypeId',fieldApiName: CITY_FIELD })
    setCityPicklistOptions({error, data}) {
      if (data) {
          this.cityFieldData = data;
        }
      }

    addRow() {
        this.idCounter++;
        this.tableData.push({ 'dataIndex': this.idCounter,
            'Id':'',
            'Salutation__c' : '',
            'First_Name__c' : '',
            'Middle_Name__c' : '',
            'Last_Name__c' : '',
            'Gender__c' : '',
            'Email__c' : '',
            'Phone__c' : '',
            'Relation__c' : '',
            'City__c': '', 
            'State__c': '',
            'Country__c': '', 
            'Zip_Code__c': '', 
            'rowEditable':true,
            'updated':false });
    }

    deleteRow(event) {
        const id = event.target.dataset.id;
        const index = this.tableData.findIndex((row) => row.dataIndex == id);
        const recordId = this.tableData[index].Id;
        if(recordId != ''){
            deleteRecord(recordId)
              .then(() => {
                this.tableData.splice(index, 1);
                this.tableData = [...this.tableData];                
                this.dispatchToastEvent('Success','Record deleted','success');
              })
              .catch(error => {
                  this.dispatchToastEvent('Error deleting record',error.body.message,'error');
              });
        }else{
          this.tableData.splice(index, 1);
          this.tableData = [...this.tableData];
        }
    }

    @track tempCandAdd = {
      'Salutation__c' : '',
      'First_Name__c' : '',
      'Middle_Name__c' : '',
      'Last_Name__c' : '',
      'Gender__c' : '',
      'Email__c' : '',
      'Phone__c' : '',
      'Relation__c' : '',
      'City__c' : '',
      'State__c' : '',
      'Country__c' : '',
      'Zip_Code__c': '',
      'updated':false,
    };
    
    handleSalutationChange(event) {
      this.tempCandAdd.Salutation__c = event.target.value;
    }
    handleFNameChange(event) {
      this.tempCandAdd.First_Name__c = event.target.value;
    }
    handleMNameChange(event) {
        this.tempCandAdd.Middle_Name__c = event.target.value;
      }
    handleLNameChange(event) {
    this.tempCandAdd.Last_Name__c = event.target.value;
    }
    handleGenderChange(event) {
        this.tempCandAdd.Gender__c = event.target.value;
    }
    handleEmailChange(event) {
    this.tempCandAdd.Email__c = event.target.value;
    }
    handlePhoneChange(event) {
    this.tempCandAdd.Phone__c = event.target.value;
    }
    handleRelationChange(event) {
      this.tempCandAdd.Relation__c = event.target.value;
    }
    handleCityChange(event) {
      this.tempCandAdd.City__c = event.target.value;
    }
    handleStateChange(event) {
      this.tempCandAdd.State__c = event.target.value;
      let key = this.cityFieldData.controllerValues[event.target.value];
      console.log(key);
      this.cityPicklist = this.cityFieldData.values.filter(opt => opt.validFor.includes(key));
    }
    handleCountryChange(event) {
      this.tempCandAdd.Country__c = event.target.value;
      let key = this.stateFieldData.controllerValues[event.target.value];
      console.log(key);
      this.statePicklist = this.stateFieldData.values.filter(opt => opt.validFor.includes(key));
    }

    handleZipChange(event) {
      this.tempCandAdd.Zip_Code__c = event.target.value;
      console.log(event.target.value);
    }

    handleCancelClick(event) {
      const index = event.target.dataset.index;
      this.tableData[index].rowEditable = false;
    }

    handleSaveClick(event) {
      const index = event.target.dataset.index;
      this.tempCandAdd.CandidateInfo_Id__c = this.candidateInfoId;
      this.tempCandAdd.Id = this.tableData[index].Id;
      console.log('Saving record...!');
      console.log('cand Id:'+ this.tempCandAdd.Id);
      let updated = this.tempCandAdd.updated;
      console.log(updated);
      if(!updated){
        createCandidateChildInfo({ tempCandAdd : this.tempCandAdd })
        .then(candidateInfoSpouseRecord => {
          this.dispatchToastEvent('Success','New Candidate Child Record Created!','success');
          this.updateTableData(candidateInfoSpouseRecord, index);
          this.errorMessage = '';
        }).catch(error => {
          console.log('Save record cause error');
          console.log(error);
          this.errorMessage = error.body.message;
          this.dispatchToastEvent('Error creating record',this.errorMessage,'error');
        });
      }else if(updated){
        updateCandidateChildInfo({ tempCandAdd : this.tempCandAdd })
        .then(candidateInfoSpouseRecord => {
          this.dispatchToastEvent('Success','Candidate Child Record Updated!','success');
          this.updateTableData(candidateInfoSpouseRecord, index);
          this.errorMessage = '';
        }).catch(error => {
          console.log('Save record cause error');
          console.log(error);
          this.errorMessage = error.body.message;
          this.dispatchToastEvent('Error updating record',this.errorMessage,'error');
        });
      }
    }

    updateTableData(candidateInfoSpouseRecord ,ind){
      console.log(candidateInfoSpouseRecord);
      console.log(ind);
      let tempCandidateRecord = {};
        tempCandidateRecord.Id = candidateInfoSpouseRecord.Id;
        tempCandidateRecord.Salutation__c = candidateInfoSpouseRecord.Salutation__c;
        tempCandidateRecord.First_Name__c = candidateInfoSpouseRecord.First_Name__c;
        tempCandidateRecord.Middle_Name__c = candidateInfoSpouseRecord.Middle_Name__c;
        tempCandidateRecord.Last_Name__c = candidateInfoSpouseRecord.Last_Name__c;
        tempCandidateRecord.Gender__c = candidateInfoSpouseRecord.Gender__c;
        tempCandidateRecord.Email__c = candidateInfoSpouseRecord.Email__c;
        tempCandidateRecord.Phone__c = candidateInfoSpouseRecord.Phone__c;
        tempCandidateRecord.Relation__c = candidateInfoSpouseRecord.Relation__c;
        tempCandidateRecord.City__c = candidateInfoSpouseRecord.City__c;
        tempCandidateRecord.State__c =candidateInfoSpouseRecord.State__c;
        tempCandidateRecord.Country__c = candidateInfoSpouseRecord.Country__c;
        tempCandidateRecord.Zip_Code__c = candidateInfoSpouseRecord.Zip_Code__c;
        tempCandidateRecord.rowEditable = false;
        tempCandidateRecord.dataIndex = ind;
        tempCandidateRecord.updated = true;
        this.tableData[ind] = Object.assign({}, tempCandidateRecord);
        this.tempCandAdd = {
                            'Salutation__c' : '',
                            'First_Name__c' : '',
                            'Middle_Name__c' : '',
                            'Last_Name__c' : '',
                            'Gender__c' : '',
                            'Email__c' : '',
                            'Phone__c' : '',
                            'Relation__c' : '',
                            'City__c' : '',
                            'State__c' : '',
                            'Country__c' : '',
                            'Zip_Code__c': '',
                            'updated':false,};
    }

  dispatchToastEvent(evtTitle, evtMessage, evtVariant){
    this.template.querySelector('c-custom-toast').showToast(evtVariant, evtMessage);
    // this.dispatchEvent(
    //   new ShowToastEvent({
    //       title: evtTitle,
    //       message: evtMessage,
    //       variant: evtVariant
    //   })
    //   );  
    }
}