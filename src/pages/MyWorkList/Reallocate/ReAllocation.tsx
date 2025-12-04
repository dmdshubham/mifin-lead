import React, { FC, useRef } from "react";
import { Portal, Box, HStack, Text, Button } from "@chakra-ui/react";
import ReallocationPopover from "@mifin/pages/MyWorkList/Reallocate/ReallocationPopover";
import { useTranslation } from "react-i18next";
import { IReallocationProps } from "@mifin/Interface/myWorklist";
import { portalStyle, refStyling } from "@mifin/theme/style";

const ReAllocation: FC<IReallocationProps> = props => {
  const { allID, setAllID, onReAllocation, searchData, allocateMaster } = props;
  const ref = useRef();
  const { t } = useTranslation();

  return (
    <>
      {allID.length !== 0 && (
        <>
          <Portal containerRef={ref} d="flex" justifyContent="flex-end">
            <Box sx={portalStyle}>
              <HStack>
                <Text>
                  {allID.length} {t("common.rowSelected")}
                </Text>
                {
                  /* <Button
                  variant="outline"
                  _hover={{
                    background: "transparent",
                    color: "white",
                  }}
                  onClick={() => setAllID([])}
                >
                  {t("common.cancel")}
                </Button> */
                  <Button
                    variant="outline"
                    _hover={{
                      background: "transparent",
                      color: "white",
                    }}
                    onClick={() => setAllID([])}
                  >
                    {t("common.cancel")}
                  </Button>
                }
                <ReallocationPopover
                  allID={allID}
                  setAllID={setAllID}
                  searchData={searchData}
                  onReAllocation={onReAllocation}
                  allocateMaster={allocateMaster}
                />
              </HStack>
            </Box>
          </Portal>
          <Box sx={refStyling} ref={ref} />
        </>
      )}
    </>
  );
};

export default ReAllocation;
