public with sharing class InfoAddressController {
    public InfoAddressController() {
    }

    class MyCustomException extends Exception {}
    public static String AddressLine_1;
    public static String AddressLine_2;
    public static String City;
    public static String State;
    public static String Country;
    public static String ZipCode;
    public static String CandidateInfo_Id;

    @AuraEnabled(cacheable=true)
    public static List<CandidateInfoAddress__c> getCandidateAddressInfoList(Id candidateId) {
        return [SELECT  Id, 
                        Address_Line_1__c,
                        Address_Line_2__c,
                        City__c,
                        State__c,
                        Country__c,
                        Zip_Code__c 
                        FROM CandidateInfoAddress__c
                        where CandidateInfo_Id__c=:candidateId];
    }

    @AuraEnabled
    public static CandidateInfoAddress__c insertCandidateAdInfo(Map<String, Object> tempCandAdd){
    try {
        inputRecord(tempCandAdd);
        if((AddressLine_1 == '') || (AddressLine_2 == '') ||(City == '') || 
            (State == '') || (Country == '')|| (ZipCode == '') ){
                throw new MyCustomException('All fields should be populated, Needs to enter data in all fields!');
        }else{
            CandidateInfoAddress__c infoAddObj = new CandidateInfoAddress__c();
            infoAddObj.Address_Line_1__c = AddressLine_1;
            infoAddObj.Address_Line_2__c = AddressLine_2;
            infoAddObj.City__c = City;
            infoAddObj.State__c = State;
            infoAddObj.Country__c = Country;
            infoAddObj.Zip_Code__c = ZipCode;
            infoAddObj.CandidateInfo_Id__c = CandidateInfo_Id;
            insert infoAddObj;
            return infoAddObj;
            }
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static CandidateInfoAddress__c updateCandidateAdInfo(Map<String, Object> tempCandAdd){
        String infoAddObjId = (String)tempCandAdd.get('Id');
        inputRecord(tempCandAdd);
        try {
            CandidateInfoAddress__c infoAddObj = new CandidateInfoAddress__c();
            infoAddObj.Id = Id.valueOf(infoAddObjId);
                if(AddressLine_1!= ''){
                    infoAddObj.Address_Line_1__c = AddressLine_1;
                }
                if(AddressLine_2 != ''){
                    infoAddObj.Address_Line_2__c = AddressLine_2;
                }
                if(City != ''){
                    infoAddObj.City__c = City;
                }
                if(State != ''){
                    infoAddObj.State__c = State;
                }
                if(Country != ''){
                    infoAddObj.Country__c = Country;
                }
                if(ZipCode != ''){
                    infoAddObj.Zip_Code__c = ZipCode;
                }
    
                update infoAddObj;
                return [SELECT  Id, 
                Address_Line_1__c,
                Address_Line_2__c,
                City__c,
                State__c,
                Country__c,
                Zip_Code__c 
                FROM CandidateInfoAddress__c WHERE Id=:infoAddObj.Id];
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void inputRecord(Map<String, Object> tempCandAdd){
        AddressLine_1 = (String)tempCandAdd.get('Address_Line_1__c');
        AddressLine_2 = (String)tempCandAdd.get('Address_Line_2__c');
        City = (String)tempCandAdd.get('City__c');
        State = (String)tempCandAdd.get('State__c');
        Country = (String)tempCandAdd.get('Country__c');
        ZipCode = String.valueOf(tempCandAdd.get('Zip_Code__c'));
        CandidateInfo_Id = (String)tempCandAdd.get('CandidateInfo_Id__c');
    }
}