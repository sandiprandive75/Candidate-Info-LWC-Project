import { LightningElement, wire, track, api } from 'lwc';
import getCandidateAddressInfoList from '@salesforce/apex/InfoAddressController.getCandidateAddressInfoList';
import createCandidateAddressInfo from '@salesforce/apex/InfoAddressController.insertCandidateAdInfo';
import updateCandidateAdInfo from '@salesforce/apex/InfoAddressController.updateCandidateAdInfo';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { deleteRecord } from 'lightning/uiRecordApi';

import ADDRESS1_FIELD from '@salesforce/schema/CandidateInfoAddress__c.Address_Line_1__c';
import ADDRESS2_FIELD from '@salesforce/schema/CandidateInfoAddress__c.Address_Line_2__c';
import CITY_FIELD from '@salesforce/schema/CandidateInfoAddress__c.City__c';
import STATE_FIELD from '@salesforce/schema/CandidateInfoAddress__c.State__c';
import COUNTRY_FIELD from '@salesforce/schema/CandidateInfoAddress__c.Country__c';
import ZIPCODE_FIELD from '@salesforce/schema/CandidateInfoAddress__c.Zip_Code__c';
import ID_FIELD from '@salesforce/schema/CandidateInfoAddress__c.Id';
import CANDINFO_OBJECT from '@salesforce/schema/CandidateInfoAddress__c';

export default class CreateNewCandidateInfoAddress extends LightningElement {
    @api candidateInfoId;
    @track editRecord = false;
    @track CandidateAddressInfoList;
    @track error;
    @track errorMessage;
    @track tempCandAdd = {
      'Address_Line_1__c' : '',
      'Address_Line_2__c' : '',
      'City__c' : '',
      'State__c' : '',
      'Country__c' : '',
      'Zip_Code__c': '',
      'updated':false,
    };

    // connectedCallback(){
    //     getCandidateAddressInfoList({candidateId:this.candidateId})
    //     .then(result => {
    //         this.CandidateAddressInfoList = result;
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
          'Address_Line_1__c': '', 
          'Address_Line_2__c': '', 
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
    @wire(getObjectInfo, { objectApiName: CANDINFO_OBJECT })
    candidateAddMetadata;

    // now get the picklist values
    @track stateFieldData;
    @track cityFieldData;
    cityPicklist='';
    statePicklist='';
    countryPicklist='';

    //fatch picklist values
    @wire(getPicklistValues,{recordTypeId: '$candidateAddMetadata.data.defaultRecordTypeId',fieldApiName: CITY_FIELD })
    setCityPicklistOptions({error, data}) {
      if (data) {
        this.cityFieldData = data;
        }
      }

    @wire(getPicklistValues,{recordTypeId: '$candidateAddMetadata.data.defaultRecordTypeId',fieldApiName: STATE_FIELD })
    setStatePicklistOptions({error, data}) {
      if (data) {
        this.stateFieldData = data;
        }
      }
        
    @wire(getPicklistValues,{recordTypeId: '$candidateAddMetadata.data.defaultRecordTypeId',fieldApiName: COUNTRY_FIELD })
    setCountryPicklistOptions({error, data}) {
    if (data) {
        this.countryPicklist = data.values;
      }
    }

    addRow() {
        this.idCounter++;
        this.tableData.push({ 'dataIndex': this.idCounter,
          'Id':'', 
          'Address_Line_1__c': '', 
          'Address_Line_2__c': '', 
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
            this.template.querySelector('c-custom-toast').showToast('success', 'Record Deleted!');
          })
          .catch(error => {
              this.dispatchToastEvent('Error deleting record',error.body.message,'error');
              this.template.querySelector('c-custom-toast').showToast('error', error.body.message);
          });
        }else{
          this.tableData.splice(index, 1);
          this.tableData = [...this.tableData];
        }
    }
    
    handleAdd1Change(event) {
      this.tempCandAdd.Address_Line_1__c = event.target.value;
    }
    handleAdd2Change(event) {
      this.tempCandAdd.Address_Line_2__c = event.target.value;
    }
    handleCityChange(event) {
      this.tempCandAdd.City__c = event.target.value;
    }
    handleStateChange(event) {
      this.tempCandAdd.State__c = event.target.value;
      let key = this.cityFieldData.controllerValues[event.target.value];
      this.cityPicklist = this.cityFieldData.values.filter(opt => opt.validFor.includes(key));
    }
    handleCountryChange(event) {
      this.tempCandAdd.Country__c = event.target.value;
      let key = this.stateFieldData.controllerValues[event.target.value];
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
        createCandidateAddressInfo({ tempCandAdd : this.tempCandAdd })
        .then(candidateInfoAddRecord => {
          this.dispatchToastEvent('Success','New Candidate Address Info Record Created!','success');
          this.template.querySelector('c-custom-toast').showToast('success', 'New Candidate Address Info Record Created!');
          this.updateTableData(candidateInfoAddRecord, index);
          this.errorMessage = '';
        }).catch(error => {
          console.log('Save record cause error');
          console.log(error);
          this.errorMessage = error.body.message;
          this.dispatchToastEvent('Error creating record',this.errorMessage,'error');
          this.template.querySelector('c-custom-toast').showToast('error', this.errorMessage);
          
        });
      }else if(updated){
        updateCandidateAdInfo({ tempCandAdd : this.tempCandAdd })
        .then(candidateInfoAddRecord => {
          this.dispatchToastEvent('Success','Candidate Address Info Record Updated!','success');
          this.template.querySelector('c-custom-toast').showToast('success', 'Candidate Address Info Record Updated!');
          this.updateTableData(candidateInfoAddRecord, index);
          this.errorMessage = '';
        }).catch(error => {
          console.log('Save record cause error');
          console.log(error);
          this.errorMessage = error.body.message;
          this.dispatchToastEvent('Error updating record',this.errorMessage,'error');
          this.template.querySelector('c-custom-toast').showToast('error', this.errorMessage);
        });
      }
    }

    updateTableData(candidateInfoAddRecord ,ind){
      let tempCandidateRecord = {};
        tempCandidateRecord.Id = candidateInfoAddRecord.Id;
        tempCandidateRecord.Address_Line_1__c = candidateInfoAddRecord.Address_Line_1__c;
        tempCandidateRecord.Address_Line_2__c = candidateInfoAddRecord.Address_Line_2__c;
        tempCandidateRecord.City__c = candidateInfoAddRecord.City__c;
        tempCandidateRecord.State__c =candidateInfoAddRecord.State__c;
        tempCandidateRecord.Country__c = candidateInfoAddRecord.Country__c;
        tempCandidateRecord.Zip_Code__c = candidateInfoAddRecord.Zip_Code__c;
        tempCandidateRecord.rowEditable = false;
        tempCandidateRecord.dataIndex = ind;
        tempCandidateRecord.updated = true;
        this.tableData[ind] = Object.assign({}, tempCandidateRecord);
        this.tempCandAdd = {'Address_Line_1__c' : '',
                            'Address_Line_2__c' : '',
                            'City__c' : '',
                            'State__c' : '',
                            'Country__c' : '',
                            'Zip_Code__c': '',
                            'updated':false,};
    }

  dispatchToastEvent(evtTitle, evtMessage, evtVariant){
    this.dispatchEvent(
      new ShowToastEvent({
          title: evtTitle,
          message: evtMessage,
          variant: evtVariant
      })
      );
    }
}