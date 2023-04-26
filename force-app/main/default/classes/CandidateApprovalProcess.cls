public with sharing class CandidateApprovalProcess {
    public CandidateApprovalProcess() {
    }
    @AuraEnabled
    public static void submitAndProcessApprovalRequest(Id candidateInfoId, Id createdById) {
        try {
        System.debug('Approval step 1');

        // Create an approval request for the account
        Approval.ProcessSubmitRequest req1 = 
            new Approval.ProcessSubmitRequest();
        req1.setComments('Submitting Candidate request for approval.');
        req1.setObjectId(candidateInfoId);
        
        // Submit on behalf of a specific submitter
        req1.setSubmitterId(createdById);
        
        // Submit the record to specific process and skip the criteria evaluation
        req1.setProcessDefinitionNameOrId('CandidateInfo_Request_Submission');
        req1.setSkipEntryCriteria(true);
        
        // Submit the approval request for the account
        Approval.ProcessResult result = Approval.process(req1);
        
        // Verify the result
        System.assert(result.isSuccess());
        
        System.assertEquals(
            'Pending', result.getInstanceStatus(), 
            'Instance Status'+result.getInstanceStatus());
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}