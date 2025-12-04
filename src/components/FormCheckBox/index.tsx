import { Checkbox } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { ChangeEvent } from "react";

const FormCheckbox = ({
  name,
  control,
  label,
  disabled = false,
  onChangeEvents,
  checked,
}) => {
  const { field } = useController({
    name,
    control,
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    field.onChange(event);

    if (onChangeEvents) {
      onChangeEvents(event);
    }
  };
  return (
    <Checkbox
      isDisabled={disabled}
      isChecked={checked}
      {...field}
      onChange={handleChange}
    >
      {label}
    </Checkbox>
  );
};

export default FormCheckbox;
