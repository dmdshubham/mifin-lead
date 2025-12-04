import React, { FC, useEffect } from "react";
import PrimaryButton from "@mifin/components/Button";
import { toastFail } from "@mifin/components/Toast";
import { useAppDispatch } from "@mifin/redux/hooks";
import { leadSearch } from "@mifin/redux/service/leadSearch/api";
import { updateLeadId } from "@mifin/redux/features/updateLeadIdSlice";
import {
  Box,
  Text,
  FormControl,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LeadSearchYupSchema from "@mifin/schema/LeadSearchYupSchema";
import { useMemo, useState } from "react";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { useLocation } from "react-router-dom";
import { sanitizedInput } from "@mifin/utils/sanitizedInput";

const LeadSearchForm: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const yupValidationSchema: any = useMemo(() => LeadSearchYupSchema(t), [t]);
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const location = useLocation();

  const {
    register,
    trigger,
    watch,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm({
    defaultValues: {
      leadSearchId: "",
    },
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });

  const defaultValues = watch();

  useEffect(() => {
    if (isDirty) trigger();
  }, [isDirty]);

  useEffect(() => {
    if (isDirty || isSaveAttempted) {
      setTimeout(trigger, 100);
    }
  }, [t]);

  const SEARCH_API_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      caseId: defaultValues.leadSearchId,
    },
  };

  const fetchLeadSearch = () => {
    dispatch(leadSearch(SEARCH_API_BODY))
      .then(res => {
        if (res.payload.statusInfo.statusCode === "200") {
          const isSearchLeadCaseId = defaultValues.leadSearchId
            .toLowerCase()
            .includes("sr");
          const showCustomerCaseId = isSearchLeadCaseId
            ? defaultValues.leadSearchId.replace("SR", "10")
            : defaultValues.leadSearchId;
          dispatch(
            updateLeadId({
              leadId: showCustomerCaseId,
            })
          );
          navigate(`/contact/${defaultValues.leadSearchId}?case=Customer`);
          localStorage.setItem("leadSearch", "true");
          // fetchShowCustomer(defaultValues.leadSearchId);
        } else if (res.payload.statusInfo.StatusCode === "300") {
          toastFail("Lead id is not available");
        }
      })
      .catch(err => {
        console.error(err);
        toastFail("Something went wrong");
        throw new Error(`An Error occured ${err}`);
      });
  };

  useEffect(() => {
    reset();
  }, [location]);
  const leadSearchId = watch("leadSearchId", "");
  const inputSize = useBreakpointValue({ base: "md", md: "sm" });
  const buttonSize = useBreakpointValue({ base: "md", md: "sm" });
  return (
    <form>
      <FormControl
        display="flex"
        alignItems={"flex-start"}
        maxW="359px"
        gap={6}
      >
 <Box>
  <Input
    {...register("leadSearchId", {
      onChange: (e) => {
        e.target.value = sanitizedInput(e.target.value);
        return e;
      },
    })}
    variant="flushed"
    placeholder={t("common.leadId")}
    fontSize={"14px"}
    fontWeight={leadSearchId ? 600 : 400}
    minW={"205"}
    _autofill={{
      boxShadow: "0 0 0px 1000px white inset",
      WebkitTextFillColor: "inherit",
      transition: "background-color 5000s ease-in-out 0s",
    }}
  />
  {errors?.leadSearchId && (
    <Text color="#e53e3e" fontSize="sm">
      {errors?.leadSearchId?.message}
    </Text>
  )}
</Box>
        <PrimaryButton
          type="button"
          title={t("common.search")}
          onClick={() => {
            setIsSaveAttempted(true);
            handleSubmit(fetchLeadSearch)();
          }}
          size={buttonSize} // Adjust button size
        />
      </FormControl>
    </form>
  );
};

export default LeadSearchForm;
