import {
  Alert,
  AlertIcon,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { Control, Controller, useController } from "react-hook-form";
import ReactSelect, { GroupBase, Props } from "react-select";
import { useEffect, useRef } from "react";
import { MifinColor } from "@mifin/theme/color";
import { customStyles } from "./customStyles";

declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    IsMulti extends boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Group extends GroupBase<Option>
  > {
    size?: "sm" | "md" | "lg";

    /** If the Select Component has Custom Label Component */
    helperText?: string;
    ref?: any;
    register?: any;
    hasInputAddon?: boolean;
    hideDropdownArrow?: boolean;
    hideSelectedValues?: boolean;
    hideContainerBorder?: boolean;
    isSingleTimeDropdown?: boolean;
    disableLeftPaddingInValueContainer?: boolean;
    isParticipantGroupContainer?: boolean;
    inheritMultiValueBG?: boolean;
    disableMultiValueRemove?: boolean;
    disabled?: boolean;
    inheritControlBG?: boolean;
    rules?: RegistrationOptions;
    setValue?: any;
    isRequired?: boolean;
    label?: string;
  }
}

type SelectProps = Props & {
  size?: "sm" | "md" | "lg";
  name: string;
  control?: Control<any>;
  hideError?: boolean;
  placeholder?: string;
  onCustomChange?: (e: any) => void;
  label?: string;
  id?: string;
  isDisable?: boolean;
  isRequired?: boolean;
  helperText?: string;
  onChange?: (e: any) => void;
  isSubmitClicked?: boolean;
};

function SelectComponent({
  size = "sm",
  label,
  control,
  name,
  id,
  value: propsValue,
  hideError = true,
  isMulti,
  isRequired,
  helperText,
  placeholder,
  isDisabled,
  onCustomChange,
  onChange,
  isSubmitClicked,
  ref,
  ...args
}: SelectProps) {
  const errorFieldRef = useRef<HTMLDivElement | null>(null);
  const {
    formState: { errors },
  } = useController({
    name,
    control,
  });

  // scroll to error input fields
  useEffect(() => {
    if (isSubmitClicked && errors[name]) {
      errorFieldRef.current?.scrollIntoView();
    }
  }, [errors, isSubmitClicked]);

  return (
    <Box ref={errorFieldRef}>
      <Controller
        name={name ?? ""}
        control={control}
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => {
          return (
            <>
              <FormControl
                variant="floating"
                id={id ?? name}
                isInvalid={!!error}
                isRequired={isRequired}
              >
                {label && (
                  <FormLabel
                    htmlFor={name}
                    color={MifinColor?.black_opacity_black_70}
                    fontWeight={400}
                    fontSize={"14px"}
                  >
                    {label}
                    {required && <span style={{ color: "red" }}>&nbsp;*</span>}
                  </FormLabel>
                )}
                <ReactSelect
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  id={id ?? name}
                  onChange={e => {
                    onChange(e);
                    if (onCustomChange !== undefined) {
                      onCustomChange({ e: e, name: name });
                    }
                  }}
                  onBlur={onBlur}
                  name={name}
                  value={propsValue ?? value ?? ""}
                  isDisabled={isDisabled}
                  placeholder={placeholder}
                  styles={{
                    ...customStyles,
                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                    singleValue: base => ({
                      ...base,
                      fontWeight: 600,
                      fontSize: "12px",
                    }),
                    option: (provided: any, state: any) => ({
                      ...provided,
                      fontWeight: 600,
                      fontSize: "12px",
                    }),
                  }}
                  size={size}
                  isMulti={isMulti}
                  isClearable
                  ref={ref}
                  {...args}
                />
                <FormErrorMessage>
                  {hideError ? "" : (error as any)?.message}
                </FormErrorMessage>
                {helperText ? (
                  <FormHelperText>
                    <Alert status="warning">
                      <AlertIcon />
                      {helperText}
                    </Alert>
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </>
          );
        }}
      />
    </Box>
  );
}

export default SelectComponent;
