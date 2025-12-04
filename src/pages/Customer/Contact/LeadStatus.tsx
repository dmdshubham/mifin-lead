import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "@mifin/redux/hooks";
import { FC, useEffect, useRef, useState } from "react";
import { getDependentMaster } from "@mifin/redux/service/getDependentMaster/api";
import EscalatePopover from "@mifin/pages/Customer/Modal/EscalatePopover";
import CoAllocatePopover from "@mifin/pages/Customer/Modal/CoAllocatePopover";
import ReferPopover from "@mifin/pages/Customer/Modal/ReferPopover";
import TextInput from "@mifin/components/Input";
import SelectComponent from "@mifin/components/SelectComponent";
import DateRange from "@mifin/components/Date";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ILeadStatusProps } from "@mifin/Interface/Customer";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import LeadGrid from "@mifin/components/LeadGrid";
import TimeKeeper from "react-timekeeper";

const LeadStatus: FC<ILeadStatusProps> = props => {
  const { defaultValues, control, watch, isConvertedToCustomer } = props;
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const followupAction: any = useAppSelector(
    state => state.getDependentMaster.data
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const nextAction = watch("action");
  const ref = useRef<HTMLDivElement | null>(null);
  const [inputType, setInputType] = useState("text");
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [inputTypFollowUpTime, setInputTypeFollowUpTime] = useState("text");
  const [openTimePickerFollowUpTime, setOpenTimePickerFollowUpTime] =
    useState(false);

  const { onToggle: onToggleTimePicker } = useDisclosure();

  const { onToggle: onToggleTimePickerFollowUpTime } = useDisclosure();

  // const handleFocus = () => {
  //   setInputType("time");
  // };

  const clockRef = useRef<HTMLDivElement | null>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (clockRef.current && !clockRef.current.contains(event.target as Node)) {
      setOpenTimePicker(false);
    }
  };

  // const handleBlur = () => {
  //   setInputType("text");
  // };

  const handleClickOutsideFollowUpTime = (event: MouseEvent) => {
    if (clockRef.current && !clockRef.current.contains(event.target as Node)) {
      setOpenTimePickerFollowUpTime(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideFollowUpTime);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFollowUpTime);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideFollowUpTime = (event: MouseEvent) => {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        // setOpenNextTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideFollowUpTime);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFollowUpTime);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        // setOpenNextTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const caseActionMaster = allMastersData?.caseActionMaster?.map(
  //   (el: ILeadStatusProps) => {
  //     return {
  //       label: el?.actionName,
  //       value: el?.actionId,
  //     };
  //   }
  // );
  const caseActionMaster = allMastersData?.caseActionMaster
    ?.filter((el: ILeadStatusProps) => el?.actionName !== "CONVERTED")
    ?.map((el: ILeadStatusProps) => ({
      label: el?.actionName,
      value: el?.actionId,
    }));

  const subQueueMaster = allMastersData?.subQueueMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.subQueue,
        value: el?.subQueueId,
      };
    }
  );

  const stageMaster = allMastersData?.stageMaster?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.stageName,
        value: el?.stageId,
      };
    }
  );

  const followUpAction = followupAction?.followUpAction?.map(
    (el: ILeadStatusProps) => {
      return {
        label: el?.value,
        value: el?.id,
      };
    }
  );

  const DEPENDENT_MASTERS = {
    ...MASTER_PAYLOAD,
    requestData: {
      idColumnName: "NEXTACTION_ID",
      valueColumnName: "NEXTACTION_NAME",
      dependentTableName: "QM_CASE_NEXT_ACTION",
      crossTableName: "QM_CASE_NEXT_ACTION",
      crossTableDependentId: "NEXTACTION_ID",
      crossTableMasterId: "ACTION_ID",
      masterValue: defaultValues?.action?.value,
    },
  };

  useEffect(() => {
    const getWorkListLeadDetails = () => {
      dispatch(getDependentMaster(DEPENDENT_MASTERS));
    };
    getWorkListLeadDetails();
  }, [nextAction]);

  return (
    <Box mx={1}>
      <Flex
        mt="8"
        mb="8"
        justify="space-between"
        flexDirection={{ sm: "column", md: "row" }}
        gap={{ sm: 18, md: 0 }}
      >
        <Heading
          as="h3"
          fontSize="18px"
          mt={{ base: "-30px", md: "0px" }}
          mb={"-9px"}
          color={"#3E4954"}
        >
          {t("contact.heading.leadStatus")}
        </Heading>

        <Flex alignItems="center" gap="3">
          <EscalatePopover isConvertedToCustomer={isConvertedToCustomer} />
          {/* <CoAllocatePopover isConvertedToCustomer={isConvertedToCustomer} /> */}
          <ReferPopover isConvertedToCustomer={isConvertedToCustomer} />
        </Flex>
      </Flex>
      <LeadGrid>
        <FormControl isRequired>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.action")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="action"
            options={caseActionMaster}
            placeholder={t("common.select")}
            isDisabled={
              isConvertedToCustomer ||
              sessionStorage.getItem("isConverted") === "true"
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.actionDate")}
          </FormLabel>
          <Controller
            control={control}
            name="actionDate"
            render={({ field: { onChange, value } }) => {
              return (
                <Box
                  sx={{
                    ".react-datepicker-wrapper input": {
                      fontWeight: 600,
                      fontSize: "12px",
                    },
                    ".react-datepicker-wrapper input::placeholder": {
                      fontSize: "12px",
                      fontWeight: 100,
                      // opacity: 0.9,
                    },
                  }}
                >
                  <DateRange
                    popperPlacement="top-start"
                    date={value}
                    setDate={onChange}
                    placeholder={t("common.select")}
                    showYear
                    showMonth
                    minDate={new Date()}
                    disabled={isConvertedToCustomer}
                  />
                </Box>
              );
            }}
          />
        </FormControl>
        {/* 
        <FormControl>
          <FormLabel>{t("contact.leadStatus.actionTime")}</FormLabel>
          <Controller
            control={control}
            name="actionTime"
            render={({ field: { onChange, value } }) => {
              return (
                <DateRange
                  id="actionTime"
                  date={value}
                  setDate={onChange}
                  placeholder={t("common.select")}
                  showTimeSelect
                  showTimeSelectOnly
                  timeCaption="Time"
                  dateFormat="h:mm aaaa"
                  timeFormat="HH:mm aaaa"
                />
              );
            }}
          />
        </FormControl> */}

        <FormControl>
          <FormLabel htmlFor="actionTime" fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.actionTime")}
          </FormLabel>
          <Controller
            control={control}
            name="actionTime"
            render={({ field: { onChange, value } }) => {
              const formatToTime = (val: any) => {
                if (!val) return "";
                const dateObj = new Date(val);
                if (!isNaN(dateObj.getTime())) {
                  const hours = String(dateObj.getHours()).padStart(2, "0");
                  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
                  return `${hours}:${minutes}`;
                }
                return typeof val === "string" && /^\d{1,2}:\d{2}$/.test(val)
                  ? val
                  : "";
              };

              const formattedValue = formatToTime(value);

              return (
                <Box
                  pos="relative"
                  sx={{
                    "& .react-timekeeper": {
                      position: "absolute",
                      zIndex: 10,
                      top: 50,
                      background: "red",
                    },
                    "& input[type='time']::-webkit-calendar-picker-indicator": {
                      pointerEvents: "none",
                      display: "none !important",
                    },
                  }}
                  ref={ref}
                >
                  <TextInput
                    name="actionTime"
                    control={control}
                    type={inputType}
                    value={formattedValue}
                    placeholder="Enter time"
                    autoComplete="off"
                    onFocus={() => {
                      setInputType("time");
                      setOpenTimePicker(true);
                    }}
                    onBlur={() => {
                      setInputType("text");
                    }}
                    onClick={onToggleTimePicker}
                    onChange={e => {
                      const inputValue = e.target.value;

                      onChange(
                        /^\d{1,2}:\d{2}$/.test(inputValue) ? inputValue : ""
                      );
                    }}
                    sx={{
                      fontSize: "12px",
                      "input::placeholder": {
                        fontSize: "12px",
                      },
                    }}
                    isDisabled={
                      isConvertedToCustomer ||
                      sessionStorage.getItem("isConverted") === "true"
                    }
                  />

                  {openTimePicker && (
                    <Box>
                      <div className="App" ref={clockRef}>
                        <TimeKeeper
                          time={formattedValue || "12:00"}
                          onChange={newTime => {
                            onChange(newTime.formatted24);
                          }}
                          onDoneClick={newTime => {
                            onChange(newTime.formatted24);
                            onToggleTimePicker();
                            setOpenTimePicker(false);
                          }}
                          doneButton={null}
                          coarseMinutes={1}
                          forceCoarseMinutes={true}
                        />
                      </div>
                    </Box>
                  )}
                </Box>
              );
            }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.followUpAction")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="followupAction"
            options={followUpAction}
            placeholder={t("common.select")}
            isDisabled={
              isConvertedToCustomer ||
              sessionStorage.getItem("isConverted") === "true"
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.followUpDate")}
          </FormLabel>
          <Controller
            control={control}
            name="followupDate"
            render={({ field: { onChange, value } }) => {
              return (
                <Box
                  sx={{
                    ".react-datepicker-wrapper input": {
                      fontWeight: 600,
                      fontSize: "12px",
                    },
                    ".react-datepicker-wrapper input::placeholder": {
                      fontSize: "12px",
                      fontWeight: 100,
                      // opacity: 0.9,
                    },
                  }}
                >
                  <DateRange
                    popperPlacement="top-start"
                    date={value}
                    setDate={onChange}
                    placeholder={t("common.select")}
                    showYear
                    showMonth
                    minDate={new Date()}
                    disabled={isConvertedToCustomer}
                  />
                </Box>
              );
            }}
          />
        </FormControl>

        {/* <FormControl>
          <FormLabel>{t("contact.leadStatus.followUpTime")}</FormLabel>
          <Controller
            control={control}
            name="followupTime"
            render={({ field: { onChange, value } }) => {
              return (
                <DateRange
                  id="followupTime"
                  date={value}
                  setDate={onChange}
                  placeholder={t("common.select")}
                  showTimeSelect
                  showTimeSelectOnly
                  timeCaption="Time"
                  dateFormat="h:mm aaaa"
                  timeFormat="HH:mm aaaa"
                />
              );
            }}
          />
        </FormControl> */}

        {/* <FormControl>
          <FormLabel htmlFor="followupTime" fontSize={"14px"}>
            {t("contact.leadStatus.followUpTime")}{" "}
          </FormLabel>
          <Controller
            control={control}
            name="followupTime"
            render={({ field: { onChange } }) => (
              <Box
                pos="relative"
                sx={{
                  "& .react-timekeeper": {
                    position: "absolute",
                    zIndex: 10,
                    top: 50,
                    background: "red",
                  },
                  "& input[type='time']::-webkit-calendar-picker-indicator": {
                    pointerEvents: "none",
                    display: "none !important",
                  },
                }}
                ref={ref}
              >
                <TextInput
                  name="followupTime"
                  control={control}
                  type={inputTypFollowUpTime}
                  onFocus={() => {
                    setInputTypeFollowUpTime("time");
                    setOpenTimePickerFollowUpTime(true);
                  }}
                  onBlur={() => {
                    setInputTypeFollowUpTime("text");
                  }}
                  onClick={onToggleTimePickerFollowUpTime}
                  placeholder="Enter "
                  autoComplete="off"
                  onChange={e => {
                    onChange(e.target.value);
                  }}
                  sx={{
                    fontSize: "12px",
                    "input::placeholder": {
                      fontSize: "12px",
                    },
                  }}
                />
                {openTimePickerFollowUpTime && (
                  <Box>
                    <div className="App" ref={clockRef}>
                      <TimeKeeper
                        onChange={newTime => {
                          onChange(
                            newTime.formatted24.split(":")[0].length > 1
                              ? newTime.formatted24
                              : "0" + newTime.formatted24
                          );
                        }}
                        onDoneClick={newTime => {
                          if (watch("followupTime") === "") {
                            onChange(
                              newTime.formatted24.split(":")[0].length > 1
                                ? newTime.formatted24
                                : "0" + newTime.formatted24
                            );
                          }
                          onToggleTimePickerFollowUpTime();
                          setOpenTimePickerFollowUpTime(false);
                        }}
                        doneButton={null}
                        coarseMinutes={1}
                        forceCoarseMinutes={true}
                      />
                    </div>
                  </Box>
                )}
              </Box>
            )}
          />
        </FormControl> */}
        <FormControl>
          <FormLabel
            htmlFor="followupTime"
            fontSize={"14px"}
            color={"#000000B3"}
          >
            {t("contact.leadStatus.followUpTime")}{" "}
          </FormLabel>
          <Controller
            control={control}
            name="followupTime"
            render={({ field: { onChange } }) => (
              <Box
                pos="relative"
                sx={{
                  "& .react-timekeeper": {
                    position: "absolute",
                    zIndex: 10,
                    top: 50,
                    background: "red",
                  },
                  "& input[type='time']::-webkit-calendar-picker-indicator": {
                    pointerEvents: "none",
                    display: "none !important",
                  },
                }}
                ref={ref}
              >
                <TextInput
                  name="followupTime"
                  control={control}
                  type={inputTypFollowUpTime}
                  onFocus={() => {
                    setInputTypeFollowUpTime("time");
                    setOpenTimePickerFollowUpTime(true);
                  }}
                  onBlur={() => {
                    setInputTypeFollowUpTime("text");
                  }}
                  onClick={onToggleTimePickerFollowUpTime}
                  placeholder="Enter "
                  autoComplete="off"
                  onChange={e => {
                    onChange(e.target.value);
                  }}
                  sx={{
                    fontSize: "12px",
                    "input::placeholder": {
                      fontSize: "12px",
                    },
                  }}
                  isDisabled={
                    isConvertedToCustomer ||
                    sessionStorage.getItem("isConverted") === "true"
                  }
                />
                {openTimePickerFollowUpTime && (
                  <Box>
                    <div className="App" ref={clockRef}>
                      <TimeKeeper
                        onChange={newTime => {
                          const formattedTime = newTime.formatted24.padStart(
                            5,
                            "0"
                          );
                          onChange(formattedTime); // Ensures proper HH:MM format
                        }}
                        onDoneClick={newTime => {
                          if (watch("followupTime") === "") {
                            const formattedTime = newTime.formatted24.padStart(
                              5,
                              "0"
                            );
                            onChange(formattedTime);
                          }
                          onToggleTimePickerFollowUpTime();
                          setOpenTimePickerFollowUpTime(false);
                        }}
                        doneButton={null}
                        coarseMinutes={1}
                        forceCoarseMinutes={true}
                      />
                    </div>
                  </Box>
                )}
              </Box>
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.leadStage")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="leadStage"
            options={stageMaster}
            placeholder={t("common.select")}
            isDisabled={
              isConvertedToCustomer ||
              sessionStorage.getItem("isConverted") === "true"
            }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.potential")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="potential"
            options={subQueueMaster}
            placeholder={t("common.select")}
            isDisabled={
              isConvertedToCustomer ||
              sessionStorage.getItem("isConverted") === "true"
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={"14px"} color={"#000000B3"}>
            {t("contact.leadStatus.remarks")}
          </FormLabel>
          <TextInput
            name="remarks"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isDisabled={
              isConvertedToCustomer ||
              sessionStorage.getItem("isConverted") === "true"
            }
          />
        </FormControl>
      </LeadGrid>
    </Box>
  );
};

export default LeadStatus;
