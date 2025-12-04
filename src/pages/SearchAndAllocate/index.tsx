import React, { useState, useEffect, FC } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
  Spacer,
  Button,
  Heading,
  GridItem,
  FormControl,
  FormLabel,
  Divider,
  useDisclosure,
  ButtonGroup,
  Box,
} from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import SearchAndAllocateTable from "@mifin/pages/SearchAndAllocate/SearchAndAllocateTable";
import AllocateTable from "@mifin/pages/SearchAndAllocate/AllocateTable";
import { useMasterDataMutation } from "@mifin/service/services-masterData";
import { useAllocatedCaseMutation } from "@mifin/service/services-searchAllocate";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import SideDrawer from "@mifin/pages/SearchAndAllocate/SideDrawer";
import LeadSearchForm from "@mifin/components/LeadSearch/LeadSearchForm";
import { useTranslation } from "react-i18next";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { saveAllocatedSearched } from "@mifin/redux/service/saveAllocatedSearch/api";
import { useAppDispatch } from "@mifin/redux/hooks";
import SelectComponent from "@mifin/components/SelectComponent";
import { useForm } from "react-hook-form";
import {
  searchAndAllocateTabStyling,
  searchAndAllocateAllocatToHeadingStyling,
} from "@mifin/theme/style";
import { useNavigate } from "react-router-dom";
import { IFormData } from "@mifin/Interface/SearchAndAllocate";
import SearchAndAllocateGrid from "@mifin/components/SearchAndAllocateGrid";
import { useLocation } from "react-router-dom";

interface remainingCase {
  rowNo: string;
  remaningCases: string;
}

interface totalCase {
  rowNo: string;
  totalCases: string;
}

const index: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: MasterList } = useMasterDataMutation();
  const { mutateAsync: AllocatedCaseList } = useAllocatedCaseMutation();
  const queryClient = useQueryClient();
  const [masterList, setMasterList] = useState({});
  const [allocatedCaseList, setAllocatedCaseList] = useState([]);
  const [showAllocateTable, setShowAllocateTable] = useState(false);
  const { t } = useTranslation();
  const [allocatedList, setAllocatedList] = useState([]);
  const [totalCase, setTotalCase] = useState<Array<totalCase>>([]);
  const [remainingCase, setRemainingCase] = useState<Array<remainingCase>>([]);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = JSON.parse(sessionStorage.getItem("userInfo") as any)?.userId;

  const { watch, control, setValue } = useForm({
    defaultValues: {
      queueId: null as null | IFormData,
    },
  });

  const defaultValues = watch();

  const handleReset = () => {
    setAllocatedList([]);
    setShowAllocateTable(false);
    setRemainingCase([]);
    // setRemainingCase(totalCase);
  };

  const allocateToList = masterList?.allocateToList?.map((el: IFormData) => {
    return {
      label: el?.userName.split(":")[1],
      value: el.userId,
    };
  });

  const defaultOption = allocateToList?.find(
    (option: any) => option.value === userId
  );

  useEffect(() => {
    setValue("queueId", {
      label: defaultOption?.label,
      value: defaultOption?.value,
    });
  }, [masterList]);

  const [drawerFormData, setDrawerFormData] = useState({});
  const allotedListData = watch("queueId") ?? "";

  const ALLOCATE_CASE_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      type: "alloted",
      userId: defaultValues?.queueId?.value ?? "",
    },
  };

  const fetchMasterData = () => {
    const data = queryClient.getQueryData("get-master-list") as any;
    if (data) {
      setMasterList(data);
      return;
    }

    try {
      MasterList({ ...MASTER_PAYLOAD }).then(res => {
        setMasterList(res.responseData);
      });
    } catch {
      (err: any) => {
        toastFail("something went wrong");
        throw new Error(`An Error occured ${err}`);
      };
    }
  };

  const fetchGetCaseData = () => {
    try {
      AllocatedCaseList(ALLOCATE_CASE_BODY).then(res => {
        setAllocatedCaseList(res?.leadList);
      });
    } catch {
      (err: any) => {
        toastFail("something went wrong");
        console.error(err);
      };
    }
  };

  const updateSaveCaseState = () => {
    const newState = allocatedList.map((obj: any) => {
      return {
        ...obj,
        allocate: obj?.allocate?.value,
        allotedList: defaultValues?.queueId?.value,
      };
    });

    return newState;
  };

  const handleSaveCase = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;

    if (updateSaveCaseState().length === 0) {
      toastFail("Please allocate the case first");
      return;
    }

    const SAVE_ALLOCATE_CASE_BODY = {
      ...MASTER_PAYLOAD,
      requestData: {
        flag: "A",
        SearchAndAllocateForm: {
          searchAndAllocateDto: [
            {
              queueId: allocatedList[0]?.queueId?.value ?? "",
              subQueueId: allocatedList[0]?.subQueue?.value ?? "",
              sourceId: allocatedList[0]?.source?.value ?? "",
              campaignId: allocatedList[0]?.campaign?.value ?? "",
              allotedList: allotedListData?.value ?? "",
              dnd: allocatedList[0]?.dnd ?? "",
              noOfCase: allocatedList[0]?.noOfCase ?? "",
              allocate: allocatedList[0]?.allocate?.value ?? "",
            },
          ],
        },
      },
    };
    dispatch(saveAllocatedSearched(SAVE_ALLOCATE_CASE_BODY))
      .then((res: any) => {
        if (
          res?.payload.statusInfo.statusCode === "200" &&
          name === "saveAndExit"
        ) {
          toastSuccess("successfully allocated");
          fetchGetCaseData();
          handleReset();
          navigate("/worklist");
        } else if (
          res?.payload.statusInfo.statusCode === "200" &&
          name === "save"
        ) {
          toastSuccess("successfully allocated");
          fetchGetCaseData();
          handleReset();
        } else if (res?.payload.statusInfo.statusCode === "400") {
          toastFail("something went wrong");
        }
      })
      .catch((err: any) => {
        console.error(err);
        toastFail("Something went wrong");
        throw new Error(`An Error occured ${err}`);
      });
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchGetCaseData();
    // handleReset();
    // setValue("queueId",null)
  }, [defaultValues?.queueId?.value]);

  useEffect(() => {
    fetchGetCaseData();
    handleReset();
    setValue("queueId", {
      label: defaultOption?.label,
      value: defaultOption?.value,
    });
  }, [location]);

  return (
    <>
      <Flex
        gap={{ base: "10px", md: "17px" }}
        my={{ base: "1", md: "6" }}
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start" }}
      >
        <Spacer />
        <Flex>
          <LeadSearchForm />
        </Flex>

        <Flex gap="10px">
          <ButtonGroup
            mt={{ base: "2", md: "0" }}
            mb={2}
            size={{ base: "sm", md: "md" }}
          >
            <Button
              variant="outline"
              textColor="blue"
              borderColor="blue"
              type="submit"
              name="saveAndExit"
              onClick={e => handleSaveCase(e)}
            >
              {t("common.saveAndExit")}
            </Button>
            <Button
              variant="outline"
              textColor="blue"
              borderColor="blue"
              type="submit"
              name="save"
              onClick={e => handleSaveCase(e)}
            >
              {t("common.save")}
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>

      <Tabs>
        <TabList>
          <Tabs
            sx={searchAndAllocateTabStyling}
            _selected={{ borderBottom: "2px solid #2F4CDD" }}
          >
            {t("searchAndAllocate.heading.allocateCases")}
          </Tabs>
        </TabList>
        <TabPanels>
          <TabPanel pl="0">
            <SearchAndAllocateGrid>
              <GridItem>
                <FormControl mt="6" width={{ base: "208%", md: "100%" }}>
                  <FormLabel
                    mb="2"
                    fontSize={{ base: "18px", md: "18px" }}
                    fontWeight="700"
                    color={"#3E4954"}
                    mt={-6}
                  >
                    {t("searchAndAllocate.convertCustomer.allocatedTo")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="queueId"
                    placeholder={t("common.select")}
                    options={allocateToList}
                    width={{ base: "200%", md: "100%" }}
                  />
                </FormControl>
              </GridItem>
            </SearchAndAllocateGrid>
            <SearchAndAllocateTable
              drawerFormData={drawerFormData}
              setDrawerFormData={setDrawerFormData}
              showAllocateTable={showAllocateTable}
              setShowAllocateTable={setShowAllocateTable}
              data={allocatedCaseList}
              onOpen={onOpen}
              totalCase={totalCase}
              setTotalCase={setTotalCase}
              remainingCase={remainingCase}
              setRemainingCase={setRemainingCase}
            />

            <Flex justify="space-between" align="center">
              {allocatedList.length > 0 && (
                <Heading as="h3" sx={searchAndAllocateAllocatToHeadingStyling}>
                  {t("searchAndAllocate.convertCustomer.allocatedTo")}
                </Heading>
              )}
              {showAllocateTable ? (
                <SideDrawer
                  selectedUser={defaultValues?.queueId?.value ?? ""}
                  allocatedList={allocatedList}
                  setAllocatedList={setAllocatedList}
                  drawerFormData={drawerFormData}
                  setDrawerFormData={setDrawerFormData}
                  setShowAllocateTable={setShowAllocateTable}
                  showAllocateTable={showAllocateTable}
                  allocateList={masterList?.allocateToList}
                  allocatedCaseList={allocatedCaseList}
                  totalCase={totalCase}
                  setTotalCase={setTotalCase}
                  remainingCase={remainingCase}
                  setRemainingCase={setRemainingCase}
                  isOpen={isOpen}
                  onClose={onClose}
                  setIsEditClicked={setIsEditClicked}
                  isEditClicked={isEditClicked}
                  onOpen={onOpen}
                  handleReset={handleReset}
                  data={allocatedCaseList}
                />
              ) : (
                <></>
              )}
            </Flex>
            <Divider />
            {allocatedList?.length > 0 && (
              <AllocateTable
                allocatedList={allocatedList}
                setAllocatedList={setAllocatedList}
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                setRemainingCase={setRemainingCase}
                remainingCase={remainingCase}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default index;
