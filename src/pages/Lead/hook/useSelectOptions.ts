import { AllMastersData, ILeadStatusProps } from "@mifin/Interface/Customer";

const useSelectOptions = (allMastersData: AllMastersData) => {
  const stageMaster = allMastersData?.stageMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.stageName,
        value: el?.stageId,
      };
    }
  );

  const sectorMaster = allMastersData?.sectorMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.sectorName,
        value: el?.sectorId,
      };
    }
  );

  const industryMaster = allMastersData?.industryMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.displayName,
        value: el?.industryId,
      };
    }
  );

  const typeOfBusinessMaster = allMastersData?.typeOfBusinessMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.typeOfBusiness,
        value: el?.id,
      };
    }
  );

  const clusterMaster = allMastersData?.clusterMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.clusterName,
        value: el?.clusterId,
      };
    }
  );

  const maritalStatus = allMastersData?.maritalStatus?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.maritalStatusname,
        value: el?.maritalStatusid,
      };
    }
  );

  const gender = allMastersData?.gender?.map((el: ILeadStatusProps) => {
    return {
      label: el?.genderName,
      value: el?.genderId,
    };
  });

  const nationality = allMastersData?.nationality?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.nationName,
        value: el?.nationalityId,
      };
    }
  );

  return {
    stageMaster,
    sectorMaster,
    industryMaster,
    typeOfBusinessMaster,
    clusterMaster,
    maritalStatus,
    gender,
    nationality,
  };
};

export default useSelectOptions;
