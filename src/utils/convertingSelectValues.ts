import { useEffect, useState } from "react";

export function convertingSelectValues(
  record: any,
  enumValue: any,
  allMastersData: any,
  allPincode?: any,
  allCities?: any,
  allTehsil?: any,
  resPinCodeOptions?: any,
  perPinCodeOptions?: any,
  offcPinCodeOptions?: any,
  resTehsilOptions?: any,
  perTehsilOptions?: any,
  offcTehsilOptions?: any
) {
  let result;
  const selectedArray = allMastersData?.[enumValue];
  const filteredState = allMastersData?.stateList?.find(
    el => el?.stateMasterId == record?.state
  )?.displayName;
  const filteredCity = allCities?.find(
    el => el?.cityMasterId == record?.city
  )?.cityMasterName;
  // const filteredPincode = allPincode?.find((el: any) => {
  //   return el.pincode === record.zipcode;
  // })?.divisionName;
  const filteredPincode = allPincode?.find((el: any) => {
    return el.pincodeMasterId === record.zipcodeId;
  })?.divisionName;

const getDivisionNameByAddressType = (addressType: string, zipcodeId: any): string | undefined => {
  const pinCodeOptions = {
    "1000000001": resPinCodeOptions,
    "1000000002": perPinCodeOptions,
    "1000000003": offcPinCodeOptions,
  }[addressType];
  return pinCodeOptions?.find((el: any) => el.id === zipcodeId)?.divisionName;
};
const divisionName = getDivisionNameByAddressType(record?.addressType, record?.zipcodeId);
const getTehsilNameByAddressType = (addressType: string, locality: any): string | undefined => {
  const tehsilOptions = {
    "1000000001": resTehsilOptions,
    "1000000002": perTehsilOptions,
    "1000000003": offcTehsilOptions,
  }[addressType];
  return tehsilOptions?.find((el: any) => el.value === locality)?.label;
};
const tehsilName = getTehsilNameByAddressType(record?.addressType, record?.locality);



  const filteredTehsil = allTehsil?.find((el: any) => {
    return el?.tehsilMasterId === record?.locality;
  })?.tehsilMasterName;
  switch (enumValue) {
    case "contact":
      selectedArray?.forEach((list: any) => {
        if (list.contactTypeId === record.contactTypeId) {
          result = list.contactType;
        }
      });
      break;

    case "address":
      result = `${
        record?.addressType == "1000000003" ? record.company_name || "" : ""
      } ${record.address || ""} ${record.flatNo || ""} ${
        record.floorNo || ""
      } ${record.landmark || ""}   ${filteredCity || record.cityName || ""} ${
        filteredState || ""} 
        
      ${tehsilName || filteredTehsil || ""} ${
        record.zipcode || ""
      }  ${divisionName || filteredPincode || ""}`.trim();
      break;
  }

  return result;
}
