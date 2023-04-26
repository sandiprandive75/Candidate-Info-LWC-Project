public with sharing class candidateInfoSpouseController {
    candidateInfoSpouseController() {
    }
    class MyCustomException extends Exception {}
    public static String Salutation;
    public static String First_Name;
    public static String Middle_Name;
    public static String Last_Name;
    public static String Email;
    public static String Phone;
    public static String Gender;
    public static String City;
    public static String State;
    public static String Country;
    public static String ZipCode;
    public static String CandidateInfo_Id;

    @AuraEnabled(cacheable=true)
    public static List<CandidateInfoSpouse__c> getCandidateSpouseInfoList(Id candidateInfoId) {
        return [SELECT  Id,
                        Salutation__c,
                        First_Name__c,
                        Middle_Name__c,
                        Last_Name__c,
                        Email__c,
                        Phone__c,
                        Gender__c,
                        City__c,
                        State__c,
                        Country__c,
                        Zip_Code__c 
                        FROM CandidateInfoSpouse__c
                        where CandidateInfo_Id__c=:candidateInfoId];
    }

    @AuraEnabled
    public static CandidateInfoSpouse__c insertCandidateSpouseInfo(Map<String, Object> tempCandAdd){
    try {
        inputRecord(tempCandAdd);
        system.debug('candidateId:'+CandidateInfo_Id);
        if((Salutation == '') || (First_Name == '') || (Last_Name == '') || 
            (Email == '') || (Phone == '') || (Country == '')|| 
            (ZipCode == '') ){
                throw new MyCustomException('All fields should be populated, Needs to enter data in all fields!');
        }else{
            CandidateInfoSpouse__c infoSpouseObj = new CandidateInfoSpouse__c();
            infoSpouseObj.Salutation__c = Salutation;
            infoSpouseObj.First_Name__c = First_Name;
            infoSpouseObj.Middle_Name__c = Middle_Name;
            infoSpouseObj.Last_Name__c = Last_Name;
            infoSpouseObj.Email__c = Email;
            infoSpouseObj.Phone__c = Phone;
            infoSpouseObj.Gender__c = Gender;
            infoSpouseObj.City__c = City;
            infoSpouseObj.State__c = State;
            infoSpouseObj.Country__c = Country;
            infoSpouseObj.Zip_Code__c = ZipCode;
            infoSpouseObj.CandidateInfo_Id__c = CandidateInfo_Id;
            insert infoSpouseObj;
            return infoSpouseObj;
            }
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static CandidateInfoSpouse__c updateCandidateSpouseInfo(Map<String, Object> tempCandAdd){
        String infoSpouseObjId = (String)tempCandAdd.get('Id');
        inputRecord(tempCandAdd);
        try {
            CandidateInfoSpouse__c infoSpouseObj = new CandidateInfoSpouse__c();
            infoSpouseObj.Id = Id.valueOf(infoSpouseObjId);
            if(Salutation!= ''){
                infoSpouseObj.Salutation__c = Salutation;
            }
            if(First_Name != ''){
                infoSpouseObj.First_Name__c = First_Name;
            }
            if(Middle_Name != ''){
                infoSpouseObj.Middle_Name__c = Middle_Name;
            }
            if(Last_Name != ''){
                infoSpouseObj.Last_Name__c = Last_Name;
            }
            if(Email != ''){
                infoSpouseObj.Email__c = Email;
            }
            if(Phone != ''){
                infoSpouseObj.Phone__c = Phone;
            }
            if(Gender != ''){
                infoSpouseObj.Gender__c = Gender;
            }
            if(City != ''){
                infoSpouseObj.City__c = City;
            }
            if(State != ''){
                infoSpouseObj.State__c = State;
            }
            if(Country != ''){
                infoSpouseObj.Country__c = Country;
            }
            if(ZipCode != ''){
                infoSpouseObj.Zip_Code__c = ZipCode;
            }

            update infoSpouseObj;
            return [SELECT  Id,
                    Salutation__c,
                    First_Name__c,
                    Middle_Name__c,
                    Last_Name__c,
                    Email__c,
                    Phone__c,
                    Gender__c,
                    City__c,
                    State__c,
                    Country__c,
                    Zip_Code__c 
                    FROM CandidateInfoSpouse__c WHERE Id=:infoSpouseObj.Id];
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void inputRecord(Map<String, Object> tempCandAdd){
        Salutation = (String)tempCandAdd.get('Salutation__c');
        First_Name = (String)tempCandAdd.get('First_Name__c');
        Middle_Name = (String)tempCandAdd.get('Middle_Name__c');
        Last_Name = (String)tempCandAdd.get('Last_Name__c');
        Email = (String)tempCandAdd.get('Email__c');
        Phone = (String)tempCandAdd.get('Phone__c');
        Gender = (String)tempCandAdd.get('Gender__c');
        City = (String)tempCandAdd.get('City__c');
        State = (String)tempCandAdd.get('State__c');
        Country = (String)tempCandAdd.get('Country__c');
        ZipCode = String.valueOf(tempCandAdd.get('Zip_Code__c'));
        CandidateInfo_Id = (String)tempCandAdd.get('CandidateInfo_Id__c');
    }
}