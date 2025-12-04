import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { MifinColor } from "@mifin/theme/color";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { saveAllocated } from "@mifin/redux/service/saveAllocated/api";
import {
  IReallocationProps,
  IReallocationFormStateProp,
} from "@mifin/Interface/components";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import {
  dividerStyling,
  formLabelStyling,
  headingStyling,
} from "@mifin/theme/style";
import { AddressProps } from "@mifin/Interface/Customer";
import LMSReallocationGrid from "@mifin/components/LMSReallocationGrid";

const Reallocation: FC<IReallocationProps> = () => {
  const [value, setValue] = useState<IReallocationFormStateProp>({
    toQueue: "",
    allocateTo: "1100000421",
    remark: "",
  });
  const masterData: any = useAppSelector(state => state.leadDetails.data);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const SAVE_ALLOCATED_LEADS = {
    ...MASTER_PAYLOAD,
    requestData: {
      inpList: ["1000000236~1100000421"],
      remark: value.remark,
      allocatedId: value.allocateTo,
      queueId: value.toQueue,
    },
  };

  const getMaterData = () => {
    dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD }));
  };

  useEffect(() => {
    getMaterData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleReallocation = () => {
    dispatch(saveAllocated(SAVE_ALLOCATED_LEADS));
  };

  return (
    <>
      {masterData.length !== 0 ? (
        <Box my={{ sm: 6, md: 8 }}>
          <form>
            <Text sx={headingStyling}>
              {t("worklist.reallocationForm.reallocation")}
            </Text>
            <Flex gap={"58px"} wrap={"wrap"}>
              <LMSReallocationGrid>
                <FormControl>
                  <FormLabel sx={formLabelStyling}>
                    {t("worklist.reallocationForm.toQueue")}
                  </FormLabel>
                  <Select
                    name="toQueue"
                    variant={"flushed"}
                    color={MifinColor.gray_500}
                    placeholder={t("worklist.reallocationForm.select")}
                    onChange={handleChange}
                  >
                    {masterData.Masters.productMaster &&
                      masterData.Masters.productMaster.map(
                        (item: AddressProps) => (
                          <option value={item.prodId} key={item.prodId}>
                            {item.prodName}
                          </option>
                        )
                      )}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel sx={formLabelStyling}>
                    {t("worklist.reallocationForm.allocateTo")}
                  </FormLabel>
                  <Select
                    name="allocateTo"
                    variant={"flushed"}
                    color={MifinColor.gray_500}
                    placeholder={t("worklist.reallocationForm.select")}
                    onChange={handleChange}
                  >
                    {/* {masterData.allocateToList &&
                  masterData.allocateToList.map((item: any) => (
                    <option value={item.prodId} key={item.prodId}>
                      {item.prodName}
                    </option>
                  ))} */}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel sx={formLabelStyling}>
                    {t("worklist.reallocationForm.remark")}
                  </FormLabel>
                  <Input
                    name="remark"
                    onChange={handleChange}
                    placeholder="-"
                    variant={"flushed"}
                  ></Input>
                </FormControl>
              </LMSReallocationGrid>
              .
              <Flex justify={"center"}>
                <Button
                  marginTop={"33px"}
                  width={"100%"}
                  variant="outline"
                  borderColor="#2F4CDD"
                  textColor="#2F4CDD"
                  onClick={handleReallocation}
                >
                  {t("worklist.reallocationForm.submit")}
                </Button>
              </Flex>
            </Flex>

            <Divider sx={dividerStyling} />
          </form>
        </Box>
      ) : null}
    </>
  );
};

export default Reallocation;
