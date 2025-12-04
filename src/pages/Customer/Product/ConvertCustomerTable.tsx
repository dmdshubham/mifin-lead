import {
  Box,
  Heading,
  Button,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useAppSelector } from "@mifin/redux/hooks";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  useSaveProductRecord,
  useProductDetails,
  useConvertToCustomer,
} from "@mifin/service/mifin-productDetails";
import { useNavigate } from "react-router-dom";
import { useApiStore } from "@mifin/store/apiStore";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import { useTranslation } from "react-i18next";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { useAppDispatch } from "@mifin/redux/hooks";
import { updateLeadHeaderDetails } from "@mifin/redux/features/leadHeaderDetailSlice";
import { ILeadDetailsProps, IndexProps } from "@mifin/Interface/Customer";
import { getDependentMaster } from "@mifin/redux/service/getDependentMaster/api";
import ConvertCustomerDrawer from "@mifin/pages/Customer/Product/ConvertCustomerDrawer";
import { ColumnDef } from "@tanstack/react-table";
import { headingStyling } from "@mifin/theme/style";
import DataTable from "@mifin/components/DataTable/customDataTable";
import { BarCircularOption } from "@mifin/assets/svgs";
import { convertToCustomer } from "@mifin/redux/service/convertToCustomer/api";
import ValidationComponent from "@mifin/components/ValidationComponent/ValidationComponent";
import { defaultValuesOfLead } from "@mifin/ConstantData/newLeadApiBody";
import { ref } from "yup";
import SingleCard from "@mifin/components/common";

const ConvertCustomerTable: FC<IndexProps> = ({ setCurrentIndex }) => {
  const particularLeadId = useAppSelector(state => state.getLeadId);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showProduct, setShowProduct] = useState([{}]);
  const [showValidationComponent, setShowValidationComponent] = useState(false);

  const [saving, setSaving] = useState(false);
  const [isDataSaved, setIsDataSaved] = useState(true);

  const [flag, setFlag] = useState(true);

  const { t } = useTranslation();

  const [isAdd, setAdd] = useState(false);
  const [apiDataToForm, setApiDataToForm] = useState([]);
  const [isConverted, setIsConverted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const dependentApi: any = useAppSelector(
    state => state.getDependentMaster.data
  );

  const methods = useForm({
    defaultValues: defaultValuesOfLead,
    mode: "onChange",
  });
  const {
    watch,
    reset,
    trigger,
    formState: { isDirty },
  } = useForm({
    defaultValues: showProduct,
  });

  const defaultValues = watch();

  useEffect(() => {
    if (isDirty) trigger();
  }, [isDirty]);
  const { userDetails } = useApiStore();

  const {
    data: ProductDetail,
    refetch,
    isLoading,
  } = useProductDetails({
    // deviceDetail: userDetails.deviceDetail,
    // userDetail: userDetails.userDetail,
    ...MASTER_PAYLOAD,
    requestData: {
      leadDetail: {
        caseId: particularLeadId.leadId,
      },
    },
  });
  const { mutateAsync: SaveProductData, isLoading: isProductSave } =
    useSaveProductRecord();
  const { mutate, isLoading: isConvertLoading } = useConvertToCustomer();
  useEffect(() => {
    if (localStorage.getItem("leadSearch") === "true") {
      setCurrentIndex(1);
      localStorage.setItem("leadSearch", "false");
    }
  }, [localStorage.getItem("leadSearch") === "true"]);

  useEffect(() => {
    setShowProduct(ProductDetail?.responseData?.oldLeadDetails);

    dispatch(
      updateLeadHeaderDetails(ProductDetail?.responseData?.leadHeaderDetail)
    );
    setIsConverted(
      ProductDetail?.responseData?.leadHeaderDetail?.disposition === "CONVERTED"
    );
    sessionStorage.setItem(
      "isConverted",
      ProductDetail?.responseData?.leadHeaderDetail?.disposition === "CONVERTED"
    );
  }, [ProductDetail]);
  useEffect(() => {
    reset(showProduct);
  }, [showProduct]);

  const data = [showProduct];

  const tableData = useMemo(() => {
    return (
      data?.map(item => ({
        schemeId: item?.schemeId ?? "",
        productId: item?.productId,
        puposeOfLoan: item?.puposeOfLoan ?? "",
        EMI: item?.EMI ?? "",
        branchId: item?.branchId ?? "",
        loanTenure: item?.loanTenure ?? "",
        loanAmount: item?.loanAmount ?? "",
      })) || []
    );
  }, [showProduct, isLoading, allMastersData, getDependentMaster]);

  const [tableDataProduct, setTableDataProduct] = useState(tableData || []);
  const [navigateFocus, setNavigateFocus] = useState<string>("");
  useEffect(() => {
    setTableDataProduct(tableData);
  }, [tableData]);
  useEffect(() => {
    if (
      ProductDetail?.responseData?.oldLeadDetails?.EMI !==
        tableDataProduct[0]?.EMI ||
      tableDataProduct[0]?.branchId !==
        ProductDetail?.responseData?.oldLeadDetails?.branchId ||
      tableDataProduct[0]?.loanTenure !==
        ProductDetail?.responseData?.oldLeadDetails?.loanTenure ||
      tableDataProduct[0]?.puposeOfLoan !==
        ProductDetail?.responseData?.oldLeadDetails?.puposeOfLoan ||
      tableDataProduct[0]?.loanAmount !==
        ProductDetail?.responseData?.oldLeadDetails?.loanAmount ||
      tableDataProduct[0]?.schemeId !==
        ProductDetail?.responseData?.oldLeadDetails?.schemeId ||
      tableDataProduct[0]?.productId !==
        ProductDetail?.responseData?.oldLeadDetails?.productId
    ) {
      setShowValidationComponent(true);
      setIsDataSaved(false);
    } else {
      setShowValidationComponent(false);
      setIsDataSaved(true); // Enable button if no changes
    }
  }, [ProductDetail, tableDataProduct]);

  const handleUpdatedProductData = (editedData: any) => {
    const updatedData2 = tableData.map(item => {
      const updatedItem = {
        ...item,
        schemeId: editedData.schemeId.value,
        productId: editedData.productId.value,
        puposeOfLoan: editedData.puposeOfLoan.value,
        EMI: editedData.EMI,
        branchId: editedData.branchId.value,
        loanTenure: editedData.loanTenure,
        loanAmount: editedData.loanAmount,
      };
      return updatedItem;
    });

    setTableDataProduct(updatedData2);
  };

  const handleEditRow = data => {
    setApiDataToForm(data);
    onOpen();
  };
  const isButtonDisabledRef = useRef(false);
  const handleConvertToCustomer = () => {
    if (isConvertLoading || isButtonDisabledRef.current) return;
    isButtonDisabledRef.current = true;
    setIsButtonDisabled(true);

    const CONVERT_TO_CUSTOMER_BODY = {
      ...MASTER_PAYLOAD,
      requestData: {
        branchId: "1000000361",
        leadDetail: {
          caseId: particularLeadId.leadId,
        },
      },
    };

    mutate(CONVERT_TO_CUSTOMER_BODY, {
      onSuccess: (data: any) => {
        isButtonDisabledRef.current = false;
        setIsButtonDisabled(false);
        if (data?.statusInfo?.statusCode === "200") {
          toastSuccess(
            `${data?.responseData?.msgConvertToCustomer} : ${data?.responseData?.ProspectNo}`
          );
          refetch();
        } else {
          toastFail(
            data?.responseData?.msgConvertToCustomer ||
              "Request not saved successfully"
          );
        }
      },
      onError: err => {
        isButtonDisabledRef.current = false; // Re-enable ref on error
        setIsButtonDisabled(false);
        console.error(err);
      },
    });
  };
  // dispatch(convertToCustomer(CONVERT_TO_CUSTOMER_BODY))
  // .then(response => {
  //   if (response?.payload?.statusInfo?.statusCode === "200") {
  //     toastSuccess(
  //       `${response?.payload?.responseData?.msgConvertToCustomer} : ${response?.payload?.responseData?.ProspectNo}`
  //     );
  //     refetch();
  //     setIsConverted(true);
  //     setSaving(true);
  //   } else if (response?.payload?.statusInfo?.statusCode === "400") {
  //     toastFail(
  //       response?.payload?.responseData?.msgConvertToCustomer ||
  //         "Request not saved successfully"
  //     );
  //     setIsConverted(false);
  //     setSaving(false);
  //   }
  // })
  // .catch(err => {
  //   toastFail("something went wrong");
  //   throw new Error(
  //     `An Error occurred ${err}` || "An Unknow Error occured"
  //   );
  // })
  // .finally(() => {
  //   setSaving(false);
  // });
  const handleSaveProduct = shouldNavigate => {
    if (saving) return;
    try {
      SaveProductData(
        {
          ...MASTER_PAYLOAD,
          requestData: {
            action: "save",
            leadDetail: {
              caseId: particularLeadId.leadId,
            },

            productDetail: {
              listXSell: null,
              hiddenLeadId: particularLeadId.leadId,
              purposeOfLoanId: tableDataProduct[0].puposeOfLoan ?? "",
              facilityRequestedBank: null,
              facilityRequested: tableDataProduct[0].productId ?? "",
              schemeId: tableDataProduct[0].schemeId ?? "",
              facilityRequestedLoanAmount: tableDataProduct[0].loanAmount ?? "",
              facilityRequestedRateOfIntrest: null,
              facilityRequestedTenor: tableDataProduct[0].loanTenure ?? "",
              facilityRequestedEmi: tableDataProduct[0].EMI ?? "",
              eligibilityId: null,
              maxLoanAmount: null,
              termCond: null,
              facilityRequestedReCalEmi: null,
              branchId: tableDataProduct[0].branchId ?? "",
              existingFacilityHistory: null,
              prodId: tableDataProduct[0].productId ?? "",
              bankId: null,
            },
          },
        },
        {
          onSuccess: (data: any) => {
            if (data?.statusInfo?.statusCode === "200") {
              toastSuccess("Product Saved Successfully");
              refetch();

              setIsDataSaved(true); // Enable the button after saving
              if (shouldNavigate) {
                // Navigate to /worklist route only if shouldNavigate is true
                navigate("/worklist");
              }
            } else {
              toastFail("Product Failed Successfully");
            }
          },
        }
      );
    } catch {
      (err: any) => {
        throw new Error(`An Error occured ${err}`);
      };
    } finally {
      setSaving(false);
    }
  };

  const DEPENDENT_MASTERS = {
    ...MASTER_PAYLOAD,
    requestData: {
      idColumnName: "PRODUCTID",
      valueColumnName: "PRODNAME",
      dependentTableName: "QM_PRODUCT",
      crossTableName: "QM_PRODUCT",
      crossTableDependentId: "PRODUCTID",
      crossTableMasterId: "1000000020",
      masterValue: defaultValues?.queueId,
    },
  };

  useEffect(() => {
    const getWorkListLeadDetails = () => {
      if (defaultValues?.queueId || defaultValues?.queueId) {
        dispatch(getDependentMaster(DEPENDENT_MASTERS));
      }
    };
    getWorkListLeadDetails();
  }, [defaultValues?.queueId]);

  const productLookup = useMemo(() => {
    const lookup = {};
    allMastersData?.productMaster?.forEach((el: ILeadDetailsProps) => {
      lookup[el.prodId] = el.prodName;
    });

    return lookup;
  }, [allMastersData]);

  const branchLookup = useMemo(() => {
    const lookupBranch = {};
    allMastersData?.branchMaster?.forEach((el: ILeadDetailsProps) => {
      lookupBranch[el.geoId] = el.geoName;
    });

    return lookupBranch;
  }, [allMastersData]);

  const schemeLookup = useMemo(() => {
    const lookupScheme = {};
    dependentApi?.scheme?.forEach((el: ILeadDetailsProps) => {
      lookupScheme[el.id] = el.value;
    });

    return lookupScheme;
  }, [dependentApi, showProduct, getDependentMaster]);

  // const purposeOfLoanLookup = useMemo(() => {
  //   const lookupPurposeOfLoan = {};
  //   allMastersData?.purposeOfLoanMaster?.forEach((el: ILeadDetailsProps) => {
  //     lookupPurposeOfLoan[el.purposeOfLoanId] = el.purposeOfLoanName;
  //   });
  //   return lookupPurposeOfLoan;
  // }, [allMastersData, tableDataProduct]);

  const formatINR = (amount: any): string => {
    let num: number;
    if (typeof amount === "number") {
      num = amount;
    } else if (typeof amount === "string") {
      const cleaned = amount.replace(/,/g, "").trim();
      num = Number(cleaned);
    } else {
      num = Number(amount);
    }
    if (isNaN(num) || !isFinite(num)) {
      return ""; 
    }
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(num);
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        header: t("product.convertCustomerTable.branch"),
        accessorKey: "branchId",
        cell: c => {
          const { branchId } = c.row.original;
          return branchLookup[branchId] ?? "";
        },
      },
      {
        header: t("product.convertCustomerTable.product"),
        accessorKey: "productId",
        cell: c => {
          const { productId } = c.row.original;
          return productLookup[productId] ?? "";
        },
      },
      {
        header: t("product.convertCustomerTable.scheme"),
        accessorKey: "schemeId",
        cell: c => {
          const { schemeId } = c.row.original;

          return schemeLookup[schemeId] && schemeLookup[schemeId] !== "N/A"
            ? schemeLookup[schemeId]
            : "";
        },
      },
      {
        header: t("product.convertCustomerTable.purposeOfLoan"),
        accessorKey: "puposeOfLoan",
        cell: c => {
          const { puposeOfLoan } = c.row.original;

          const purposeOfLoanData = allMastersData?.purposeOfLoanMaster?.find(
            (item: any) => {
              return item?.purposeOfLoanId === puposeOfLoan;
            }
          )?.purposeOfLoanName;
          return purposeOfLoanData;
        },
      },
      {
        header: t("product.convertCustomerTable.loanAmount"),
        accessorKey: "loanAmount",
        cell: c => {
          const val = c.row.original.loanAmount;
          const formatted = formatINR(val);
          return formatted || "N/A"; // if formatted is empty string, show "N/A"
        },
      },
      {
        header: t("product.convertCustomerTable.tenure"),
        accessorKey: "loanTenure",
        cell: c => {
          const { loanTenure } = c.row.original;

          return loanTenure && loanTenure !== "N/A" ? loanTenure : "";
        },
      },
      {
        header: t("product.convertCustomerTable.affordableEmi"),
        accessorKey: "EMI",
        cell: c => {
          const val = c.row.original.EMI;
          const formatted = formatINR(val);
          return formatted || "N/A";
        },
      },
      {
        header: "action",
        accessorKey: "button",
        size: 27,
        cell: c => {
          return (
            <>
              <Flex gap={5}>
                <IconButton
                  aria-label="Edit"
                  colorScheme="teal"
                  variant="ghost"
                  onClick={() => handleEditRow(c.row.original)}
                >
                  <BarCircularOption />
                </IconButton>
                <Button
                  width={"100%"}
                  px={3}
                  colorScheme="blue"
                  onClick={() => {
                    handleConvertToCustomer();
                  }}
                  isDisabled={
                    !isDataSaved ||
                    isConverted ||
                    isConvertLoading ||
                    isButtonDisabled
                  }
                  isLoading={isConvertLoading}
                >
                  Convert to Customer
                </Button>
              </Flex>
            </>
          );
        },
      },
    ];
  }, [schemeLookup, tableDataProduct, isDataSaved]);

  const pathName = useMemo(() => {
    const pathnameArray = window.location.pathname.split("/");
    return pathnameArray[pathnameArray.length - 1];
  }, []);
  const handleOnInputNavigate = (fieldName: string) => {
    ref.current[fieldName]?.focus();
    setNavigateFocus(fieldName);
  };

  return (
    <Box
      mt={{ base: "1", md: "8" }}
      width="100%"
      mb={{ base: "2", md: "55px" }}
    >
      <Flex gap={2} justifyContent={"space-between"} mb={"10px"} ml={"-10px"}>
        <Heading sx={headingStyling}>
          {t("product.heading.convertToCustomer")}
        </Heading>
      </Flex>

      <FormProvider {...methods}>
        {/* <ValidationComponent
          setButtonClickStatus={setButtonClickStatus}
          onClick={() => handleSaveProduct(false)}
          onInputNavigate={(fieldName: string) =>
            handleOnInputNavigate(fieldName)
          }
          pathName={pathName}
          onCancel={() => reset(defaultValuesOfLead)}
          isSubmitting={isProductSave}
        /> */}
        {showValidationComponent && (
          <ValidationComponent
            isOpen={showValidationComponent}
            onClose={() => setShowValidationComponent(false)}
            onSubmit={handleConvertToCustomer}
            onClick={() => handleSaveProduct(false)}
            onInputNavigate={(fieldName: string) =>
              handleOnInputNavigate(fieldName)
            }
            pathName={pathName}
            isSubmitting={isProductSave}
            onCancel={() => reset(defaultValuesOfLead)}
          />
        )}
      </FormProvider>
      <ConvertCustomerDrawer
        flag={isAdd}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setAdd(false);
        }}
        drawerData={apiDataToForm}
        setFlag={setFlag}
        setUpdatedTableData={handleUpdatedProductData}
      />
      <Box display={{ base: "none", md: "block" }}>
        <DataTable columns={columns} data={tableDataProduct ?? []} />
      </Box>
      <Box display={{ base: "block", md: "none" }} pb={3}>
        {tableDataProduct.map((single, index) => (
          <Box key={index} marginLeft={-4} marginRight={-4} p="0">
            <SingleCard data={single} key={index}>
              <Flex gap={10} mr={"40px"}>
                <Button
                  width={"100%"}
                  px={3}
                  colorScheme="blue"
                  onClick={() => {
                    handleConvertToCustomer();
                  }}
                  isDisabled={
                    !isDataSaved ||
                    isConverted ||
                    isConvertLoading ||
                    isButtonDisabled
                  }
                  isLoading={isConvertLoading}
                >
                  Convert to Customer
                </Button>
                <IconButton
                  mr={-6}
                  aria-label="Edit"
                  colorScheme="grey.200"
                  variant="ghost"
                  onClick={() => handleEditRow(single)}
                >
                  <BarCircularOption width="24px" height="24px" />
                </IconButton>
              </Flex>
            </SingleCard>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ConvertCustomerTable;
