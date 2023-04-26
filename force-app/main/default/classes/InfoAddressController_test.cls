@isTest
public class InfoAddressController_test {
    
    @TestSetup
    public static void testSetup_method(){           
    }
    
    @isTest
    public static void getCandidateAddressInfoList_test(){
       	CandidateInfo__c candidateInfoRecord = CreateTestData_Candidate.insertCandidateInfo();
        CandidateInfoAddress__c candidateInfoAddressRecord = CreateTestData_Candidate.insertCandidateInfoAdd(candidateInfoRecord.Id);
        
        List<CandidateInfoAddress__c> fetchCandidateAddInfo = InfoAddressController.getCandidateAddressInfoList(candidateInfoRecord.Id);
        System.assertEquals('Test Add1', fetchCandidateAddInfo[0].Address_Line_1__c);
    }

    @isTest
    public static void insertCandidateAdInfo_test(){
        CandidateInfo__c candidateInfoRecord = CreateTestData_Candidate.insertCandidateInfo();
        
        Map<String, Object> tempCandAdd=New Map<String, Object>();
        tempCandAdd.put('Address_Line_1__c','Test Add1');
        tempCandAdd.put('Address_Line_2__c','Test Add2');
        tempCandAdd.put('City__c','Pune');
        tempCandAdd.put('State__c','Maharashtra');
        tempCandAdd.put('Country__c','India');
        tempCandAdd.put('Zip_Code__c','123456');
        tempCandAdd.put('CandidateInfo_Id__c',candidateInfoRecord.Id);

        CandidateInfoAddress__c candidateAddInfoResult = InfoAddressController.insertCandidateAdInfo(tempCandAdd);
        System.assertEquals('Test Add1', candidateAddInfoResult.Address_Line_1__c);
    }
    
    @isTest
    public static void updateCandidateAdInfo_test(){
        CandidateInfo__c candidateInfoRecord = CreateTestData_Candidate.insertCandidateInfo();
        CandidateInfoAddress__c candidateInfoAddressRecord = CreateTestData_Candidate.insertCandidateInfoAdd(candidateInfoRecord.Id);
        Id candidateAddInfoId = candidateInfoAddressRecord.Id;
        
        Map<String, Object> tempCandAdd=New Map<String, Object>();
        tempCandAdd.put('Address_Line_1__c','Updated Add Line1');
        tempCandAdd.put('Address_Line_2__c','Test Add2');
        tempCandAdd.put('City__c','Pune');
        tempCandAdd.put('State__c','Maharashtra');
        tempCandAdd.put('Country__c','India');
        tempCandAdd.put('Zip_Code__c','123456');
        tempCandAdd.put('CandidateInfo_Id__c',candidateInfoRecord.Id);
        tempCandAdd.put('Id',candidateAddInfoId);
        
        CandidateInfoAddress__c candidateAddInfoUpdateResult = InfoAddressController.updateCandidateAdInfo(tempCandAdd);
        System.assertEquals('Updated Add Line1', candidateAddInfoUpdateResult.Address_Line_1__c);
    }
}