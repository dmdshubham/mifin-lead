import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";

const DocumentformData = {
  ...MASTER_PAYLOAD,
  requestData: {
    leadDetail: {
      caseId: "1000000873",
      prospectId: "1000000282",
      prospectCode: "BID000000000863",
      queueId: "1000000009",
    },
    docType: "",
  },
};

export default DocumentformData;
