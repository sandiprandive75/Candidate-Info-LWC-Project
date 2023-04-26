public with sharing class CandidateInfoClass {
    public CandidateInfoClass() {
    }

    @AuraEnabled
    public static CandidateInfo__c createCandidateInfo(CandidateInfo__c cadInfoRec){
        insert cadInfoRec;
        return cadInfoRec;
    }

    @AuraEnabled(cacheable=true)
    public static list<CandidateInfo__c> getApprovalRequests(String approvalStatus){
        try {
            return [Select Id,
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
                        Zip_Code__c,
                        Status__c,
                        CreatedById
                        FROM CandidateInfo__c 
                        WHERE Status__c=:approvalStatus
                        ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled(cacheable=true)
    // public static Map<Id, CandidateInfo__c> getApprovalRequestsMap(String approvalStatus){
    //     try {
    //         List<CandidateInfo__c> candInfo =[Select 
    //                                             Id,
    //                                             Salutation__c,
    //                                             First_Name__c,
    //                                             Middle_Name__c,
    //                                             Last_Name__c,
    //                                             Email__c,
    //                                             Phone__c,
    //                                             Gender__c,
    //                                             City__c,
    //                                             State__c,
    //                                             Country__c,
    //                                             Zip_Code__c,
    //                                             Status__c,
    //                                             CreatedById
    //                                             FROM CandidateInfo__c 
    //                                             WHERE Status__c=:approvalStatus
    //                                             ];
    //         Map<Id, CandidateInfo__c> candInfoMap = new Map<Id, CandidateInfo__c>(candInfo);
    //         return candInfoMap;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}