import { Flex, useStyleConfig } from "@chakra-ui/react";

import { IAppBarProps } from "@mifin/Interface/components";

const AppBar: React.FC<IAppBarProps> = props => {
  const { children, variants, ...rest } = props;
  const styles = useStyleConfig("AppBar", variants);

  return (
    <Flex __css={styles} {...rest}>
      {children}
    </Flex>
  );
};

export default AppBar;
