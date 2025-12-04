import { MifinColor } from "@mifin/theme/color";

const RequiredMark = ({ color = MifinColor?.primary_red, children = "*" }) => {
  return <span style={{ color }}>{children}</span>;
};

export default RequiredMark;
