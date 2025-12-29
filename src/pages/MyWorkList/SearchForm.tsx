import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import PrimaryButton from "@mifin/components/Button/index";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Arrow } from "@mifin/assets/svgs/arrow.svg";
import { ReactComponent as DArrow } from "@mifin/assets/svgs/downArrow.svg";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import SelectComponent from "@mifin/components/SelectComponent";
import { useForm } from "react-hook-form";
import { useGetLeadListMutation } from "@mifin/service/mifin-getLeadDetails";
import { ISearchFormProps } from "@mifin/Interface/myWorklist";
import { useEffect } from "react";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { sortOrderData, sortByData } from "@mifin/ConstantData/dopdownData";
import { searchFormBoxStyling } from "@mifin/theme/style";
import getFlattenArray from "@mifin/utils/getFlattenArray";
import SearchFormControlGrid from "@mifin/components/SearchFormControlGrid";
import TextInput from "@mifin/components/Input";
import { useLocation } from "react-router-dom";
import { toastFail } from "@mifin/components/Toast";
import { ILeadStatusProps } from "@mifin/Interface/Customer";

const formDefaultValues = {
  mobile: "",
  email: "",
  name: "",
  caseId: "",
  leadState: "",
  escalationRef: "MYLEAD",
  queue: "",
  subqueue: "",
  disposition: "",
  actionId: "",
  allocate: "",
  amountTo: "",
  amountFrom: "",
  source: "",
  sort1: "",
  sort2: "",
  sort3: "",
  currentPosition: 10,
  maxResult: 0,
  sortOrder: "",
  caseCode: "",
  company: "1000000001",
  id: "",
  campaign: "",
  team: "",
  syncDate: "",
  branch: "",
};

const SearchForm: FC<ISearchFormProps> = props => {
  const { setSearchData, setAllID } = props;
  const { t } = useTranslation();
  const [showAdvance, setShowAdvance] = useState(false);
  const masterData: any = useAppSelector(state => state.leadDetails);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { mutateAsync: mutateLeadList } = useGetLeadListMutation();
  const [isSort1Selected, setIsSort1Selected] = useState(false);
  const [isSort2Selected, setIsSort2Selected] = useState(false);
  const [searchButton, setSearchButton] = useState("");
  const { register, handleSubmit, control, watch, reset } = useForm({
    defaultValues: formDefaultValues,
  });
  const defaultValues = watch();
  const allMastersData = { ...masterData?.data?.Masters };
  const allocateDetails = masterData?.data?.allocateToList;
  const trimmedCaseCode = defaultValues?.caseCode.trim();
  const productMaster = allMastersData?.productMaster?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.prodName,
        value: el?.prodId,
      };
    }
  );

  const caseActionMaster = allMastersData?.caseActionMaster?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.actionName,
        value: el?.actionId,
      };
    }
  );

  const subQueueMaster = allMastersData?.subQueueMaster?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.subQueue,
        value: el?.subQueueId,
      };
    }
  );

  const sourceMaster = allMastersData?.sourceMaster?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.sourceName,
        value: el?.caseSourceId,
      };
    }
  );

  const campaignMaster = allMastersData?.campaignMaster?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.campaignName,
        value: el?.campaignId,
      };
    }
  );

  const allocateDetailsMaster = allocateDetails?.map((el: ISearchFormProps) => {
    return {
      label: el?.userName,
      value: el?.userId,
    };
  });

  const sortByMaster = sortByData?.map((el: ISearchFormProps) => {
    return {
      label: el?.sortByName,
      value: el?.sortById,
    };
  });

  const sortOrderMaster = sortOrderData?.map((el: ISearchFormProps) => {
    return {
      label: el?.sortOrderName,
      value: el?.sortOrderId,
    };
  });

  const leadStateMaster = allMastersData?.stageMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.stageName,
        value: el?.stageId,
      };
    }
  );
  const handleToggle = () => setShowAdvance(!showAdvance);

  const getMaterData = () => {
    dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD }));
  };
  const fetchTableData = () => {
    const searchMobile = watch("mobile");
    const searchName = watch("name");
    const searchEmail = watch("email");
    const searchLead = watch("caseCode");

    if (
      !showAdvance &&
      !searchMobile &&
      !searchName &&
      !searchEmail &&
      !searchLead
    ) {
      // if (watch() !== defaultValues) {
      toastFail("Please fill at least one of the fields to search.");
      return;
    }

    const data = getFlattenArray(defaultValues);

    const reqBody = {
      ...MASTER_PAYLOAD,
      requestData: {
        iDisplayStart: "0",
        iDisplayLength: "10",
        sEcho: "1",
        leadsSearchDetail: {
          requestType: searchButton != "" ? searchButton : "myLead",
          ...data,
          caseCode: trimmedCaseCode,
        },
      },
    };

    const searchReqData = {
      requestType: searchButton != "" ? searchButton : "myLead",
      ...data,
      caseCode: trimmedCaseCode,
    };
    //setSearchData(data);
    setSearchData(searchReqData);
    setAllID([]);
    mutateLeadList(reqBody);
    reset();
  };

  const onSubmit = () => {
    fetchTableData();
  };

  // useEffect(() => {
  //   fetchTableData();
  // }, [location]);

  useEffect(() => {
    // function to check the prev sort selected
    const checkSortSelected = () => {
      if (defaultValues.sort1 || defaultValues.sort1?.toString() !== "-1") {
        setIsSort1Selected(true);
      }

      if (!defaultValues.sort1 || defaultValues.sort1?.toString() === "-1") {
        setIsSort1Selected(false);
      }

      if (defaultValues.sort2 || defaultValues.sort2?.toString() !== "-1") {
        setIsSort2Selected(true);
      }

      if (
        !defaultValues.sort2 ||
        defaultValues.sort2?.toString() === "-1" ||
        !defaultValues.sort1 ||
        defaultValues.sort1?.toString() === "-1"
      ) {
        setIsSort2Selected(false);
      }
    };

    checkSortSelected();
  }, [defaultValues.sort1, defaultValues.sort2]);

  useEffect(() => {
    reset();
  }, []);

  return (
    <Box my={{ sm: 6, md: 8 }} p={{ sm: 4, md: 6 }} sx={searchFormBoxStyling}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Single Row Layout for Main Search Fields */}
        <Flex
          gap={{ base: 3, md: 4 }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
          alignItems="flex-end"
        >
          <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
            <FormLabel htmlFor="mobile" fontSize={"14px"} mb={1}>
              {t("worklist.searchForm.mobileNumber")}
            </FormLabel>
            <TextInput
              type="number"
              placeholder={t("worklist.searchForm.mobileNumberPlaceholder")}
              name="mobile"
              control={control}
            />
          </FormControl>

          <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
            <FormLabel htmlFor="email" fontSize={"14px"} mb={1}>
              {t("worklist.searchForm.emailId")}
            </FormLabel>
            <TextInput
              type="email"
              placeholder={t("worklist.searchForm.emailIdPlaceholder")}
              name="email"
              control={control}
            />
          </FormControl>

          <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
            <FormLabel fontSize={"14px"} mb={1}>
              {t("worklist.searchForm.name")}
            </FormLabel>
            <TextInput
              regex="alphabet"
              name="name"
              type="text"
              control={control}
              placeholder={t("worklist.searchForm.namePlaceHolder")}
            />
          </FormControl>

          <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
            <FormLabel htmlFor="caseCode" fontSize={"14px"} mb={1}>
              {t("worklist.searchForm.lead")}
            </FormLabel>
            <TextInput
              placeholder={t("worklist.searchForm.leadPlaceholder")}
              name="caseCode"
              type="text"
              control={control}
            />
          </FormControl>

          {!showAdvance && (
            <Box flex={{ base: "1 1 100%", md: "0 0 auto" }}>
              <PrimaryButton
                type="submit"
                title={t("common.search")}
                onClick={() => {
                  setSearchButton("search");
                }}
              />
            </Box>
          )}
        </Flex>
        {/* Show/Hide Advanced Toggle */}
        <Flex gap={4} alignItems="center" mt="16px">
          <Text
            size="xs"
            color="blue"
            onClick={() => {
              handleToggle();
              getMaterData();
            }}
            cursor="pointer"
            _active={{ bg: "transparent" }}
            _hover={{ textDecoration: "underline" }}
          >
            {showAdvance ? t("common.hideAdvance") : t("common.showAdvance")}
          </Text>
          <Text onClick={() => handleToggle()} cursor="pointer">
            {showAdvance ? <DArrow /> : <Arrow />}
          </Text>
        </Flex>

        <Box mt={{ base: "4", md: "6" }}>
          {showAdvance ? (
            <Box>
              {/* Advanced Search - Row 1 */}
              <Flex
                gap={{ base: 3, md: 4 }}
                flexWrap={{ base: "wrap", md: "nowrap" }}
                mb={6}
              >
                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.queue")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="queue"
                    options={productMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>

                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.potential")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="subqueue"
                    options={subQueueMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>

                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.action")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="actionId"
                    options={caseActionMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>
              </Flex>

              {/* Advanced Search - Row 2 */}
              <Flex
                gap={{ base: 3, md: 4 }}
                flexWrap={{ base: "wrap", md: "nowrap" }}
                mb={6}
              >
                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.leadStage")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="leadState"
                    options={leadStateMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>

                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.campain")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="campaign"
                    options={campaignMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>

                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.allocatedTo")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="allocate"
                    options={allocateDetailsMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>
              </Flex>

              {/* Advanced Search - Row 3 */}
              <Flex
                gap={{ base: 3, md: 4 }}
                flexWrap={{ base: "wrap", md: "nowrap" }}
                mb={6}
              >
                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.amountFrom")}
                  </FormLabel>
                  <TextInput
                    type="number"
                    regex="numeric"
                    name="amountFrom"
                    control={control}
                    placeholder={t("common.enter")}
                  />
                </FormControl>

                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.amountTo")}
                  </FormLabel>
                  <TextInput
                    type="number"
                    regex="numeric"
                    name="amountTo"
                    control={control}
                    placeholder={t("common.enter")}
                  />
                </FormControl>

                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.source")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="source"
                    options={sourceMaster}
                    placeholder={t("common.select")}
                  />
                </FormControl>
              </Flex>

              {/* Sort Order Row */}
              <Flex gap={{ base: 3, md: 4 }} alignItems="flex-end">
                <FormControl flex={{ base: "1 1 100%", md: "1 1 auto" }}>
                  <FormLabel fontSize={"14px"} mb={1}>
                    {t("worklist.advanceSearch.sortOrder")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="sortOrder"
                    options={sortOrderMaster}
                  />
                </FormControl>
                {/* <FormControl mt={1}>
                  <FormLabel fontSize={"14px"}>
                    {t("worklist.advanceSearch.sortBy")} 1
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="sort1"
                    options={sortByMaster}
                    // placeholder={t("common.noneSelected")}
                  />
                </FormControl>
                <FormControl mt={1}>
                  <FormLabel fontSize={"14px"}>
                    {t("worklist.advanceSearch.sortBy")} 2
                  </FormLabel>

                  <SelectComponent
                    control={control}
                    name="sort2"
                    options={sortByMaster}
                    placeholder={t("common.select")}
                    isDisabled={!isSort1Selected}
                  />
                </FormControl>
                <Box mt={{ base: 2, md: -8 }}>
                  <FormControl mt={0.5}>
                    <FormLabel fontSize={"14px"}>
                      {t("worklist.advanceSearch.sortBy")} 3
                    </FormLabel>

                    <SelectComponent
                      control={control}
                      name="sort3"
                      options={sortByMaster}
                      placeholder={t("common.select")}
                      isDisabled={!isSort2Selected}
                    />
                  </FormControl>
                </Box> */}
              </Flex>

              <Box mt={6}>
                <PrimaryButton
                  type="submit"
                  title={t("common.search")}
                  onClick={() => {
                    setSearchButton("search");
                  }}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
      </form>
    </Box>
  );
};

export default SearchForm;
