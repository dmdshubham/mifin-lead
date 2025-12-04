import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { TextInputProps } from "@mifin/Interface/Customer";
import { MifinColor } from "@mifin/theme/color";
import React, {
  ChangeEvent,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from "react";
import { Controller } from "react-hook-form";
import { InputConfig } from "./customStyles";
import { useCurrencyToggle } from "@mifin/store/useCurrencyToggle";
import { sanitizedInput } from "@mifin/utils/sanitizedInput";

const TextInput = forwardRef<
  HTMLInputElement,
  TextInputProps & InputProps & TextareaProps
>((props, ref) => {
  const {
    name,
    control,
    label,
    type,
    isRequired,
    startIcon,
    disabled,
    endIcons,
    onIconClick,
    variant,
    noFloating,
    onCustomChange,
    hideError = true,
    id,
    onBlur,
    onFocus,
    regex,
    maxLength,
    formatAsCommaSeparated = false,
    ...extraProps
  } = props;

  const errorFieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState<number | null>(null);

  useEffect(() => {
    if (inputRef.current && cursorPos !== null) {
      inputRef.current.setSelectionRange(cursorPos, cursorPos);
    }
  }, [cursorPos]);

  // const formatNumber = (value: string): string => {
  //   if (!value) return "";

  //   const { isUsCurrency } = useCurrencyToggle();
  //   // Remove all non-digit characters except decimal point
  //   const numericString = value.replace(/[^0-9.]/g, "");
  //   const numericValue = parseFloat(numericString);

  //   if (isNaN(numericValue)) return "";

  //   return isUsCurrency
  //     ? numericValue.toLocaleString("en-US")
  //     : numericValue.toLocaleString("en-IN");
  // };
  // const formatNumber = (value: string) => {
  //   const { isUsCurrency } = useCurrencyToggle();
  //   const inputValue = value ? parseFloat(value.replace(/,/g, "")) : NaN;

  //   if (!isNaN(inputValue)) {
  //     return isUsCurrency
  //       ? inputValue.toLocaleString("en-US")
  //       : inputValue.toLocaleString("en-IN");
  //   }
  //   return "";
  // };
  const formatIndianNumber = (value: string): string => {
    // Remove all existing commas and non-digit characters
    const numericString = value.replace(/\D/g, "");

    if (!numericString) return "";

    // Handle special case for single zero
    if (numericString === "0") return "0";

    let formatted = "";
    let count = 0;

    // Process from right to left
    for (let i = numericString.length - 1; i >= 0; i--) {
      formatted = numericString[i] + formatted;
      count++;

      // Add comma after every 2 digits except:
      // - At the very beginning (i > 0)
      // - Not after the first 3 digits (count !== 3)
      if (count % 2 === 0 && i > 0 && count !== 3) {
        formatted = "," + formatted;
      }
    }

    return formatted;
  };

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const { value, selectionStart } = e.target;

    // Get raw numeric value (without commas)
    const rawValue = value.replace(/\D/g, "");

    // Count commas before cursor
    const commaCountBefore = (
      value.substring(0, selectionStart || 0).match(/,/g) || []
    ).length;

    // Format the number
    const formattedValue = formatIndianNumber(rawValue);

    // Count commas in new formatted value
    const commaCountAfter = (formattedValue.match(/,/g) || []).length;

    // Calculate cursor position adjustment
    const cursorAdjustment = commaCountAfter - commaCountBefore;
    const newCursorPosition = Math.max(
      0,
      Math.min((selectionStart || 0) + cursorAdjustment, formattedValue.length)
    );

    // Update the form value with raw number
    onChange(rawValue);

    // Update input display and cursor position
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = formattedValue;
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    });
  };

  const parseFormattedNumber = (formattedValue: string): string => {
    // Remove all formatting commas and return raw number string
    return formattedValue.replace(/,/g, "");
  };

  const handleNumericInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const { value, selectionStart } = e.target;

    // Save cursor position before any transformations
    setCursorPos(selectionStart);

    // Store the raw value (without commas) in the form state
    const rawValue = parseFormattedNumber(value);
    onChange(rawValue);

    onCustomChange?.();
  };

  const handleDefaultInputChange = (
  e: ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const { value, selectionStart } = e.target;
  let processedValue = sanitizedInput(value); 

  if (regex === "numeric") {
    processedValue = processedValue.replace(/\D/g, "");
  } else if (regex === "alphabet") {
    processedValue = processedValue.replace(/[^A-Za-z\s]/g, "").toUpperCase();
  } else if (regex === "alphaNumeric") {
    processedValue = processedValue.replace(/[^A-Za-z0-9]+/g, "").toUpperCase();
  } else if (regex === "floating") {
    processedValue = processedValue.replace(/[^0-9.]/g, "");
  } else if (regex === "alphabetspace") {
    processedValue = processedValue.replace(/[^A-Za-z\s]/g, "").toUpperCase();
  }

  if (maxLength && processedValue.length > Number(maxLength)) {
    processedValue = processedValue.slice(0, Number(maxLength));
  }

  setCursorPos(selectionStart);
  onChange(processedValue);
  onCustomChange?.();
};

  return (
    <Box ref={errorFieldRef}>
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, value, ref: controllerRef },
          fieldState: { error },
        }) => {
          // const displayValue = formatAsCommaSeparated
          //   ? formatNumber(value || "")
          //   : value || "";
          // In your component render:
          // const displayValue = formatAsCommaSeparated
          //   ? formatNumber(value)
          //   : value;

          return (
            <FormControl
              variant={noFloating ? "default" : "Flushed"}
              id={id ?? name}
              isRequired={!!isRequired}
              isInvalid={!!error}
            >
              <InputGroup height={type !== "textarea" ? "46px" : "auto"}>
                {startIcon && (
                  <InputLeftElement
                    top="12%"
                    pointerEvents="none"
                    onClick={onIconClick}
                  >
                    {startIcon}
                  </InputLeftElement>
                )}

                {type === "textarea" ? (
                  <Textarea
                    onBlur={onBlur}
                    paddingLeft={startIcon ? 9 : ""}
                    placeholder=" "
                    height="inherit"
                    onChange={e => onChange(e.target.value)}
                    value={value ?? ""}
                    isInvalid={!!error}
                    disabled={disabled}
                    variant={variant}
                    {...InputConfig}
                    {...extraProps}
                  />
                ) : (
                  <>
                    {label && (
                      <FormLabel
                        htmlFor={name}
                        color="black"
                        fontWeight={400}
                        fontSize="14px"
                      >
                        {label}
                        {isRequired && (
                          <span style={{ color: "red" }}>&nbsp;*</span>
                        )}
                      </FormLabel>
                    )}

                    <Input
                      ref={el => {
                        if (el) {
                          inputRef.current = el;
                          if (typeof controllerRef === "function") {
                            controllerRef(el);
                          } else if (controllerRef) {
                            (
                              controllerRef as React.MutableRefObject<HTMLInputElement>
                            ).current = el;
                          }
                          if (typeof ref === "function") {
                            ref(el);
                          } else if (ref) {
                            (
                              ref as React.MutableRefObject<HTMLInputElement>
                            ).current = el;
                          }
                        }
                      }}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      paddingLeft={startIcon ? 9 : ""}
                      placeholder={noFloating ? label : " "}
                      type={type}
                      name={name}
                      height="inherit"
                      id={id ?? name}
                      errorBorderColor={MifinColor?.gray_200}
                      min={0}
                      // onChange={e =>
                      //   formatAsCommaSeparated
                      //     ? handleNumericInputChange(e, onChange)
                      //     : handleDefaultInputChange(e, onChange)
                      // }
                      // value={displayValue}
                      // onChange={e => {
                      //   if (formatAsCommaSeparated) {
                      //     handleNumericInput(e, onChange);
                      //   } else {
                      //     onChange(e.target.value);
                      //   }
                      // }}
                      onChange={e => {
                        if (formatAsCommaSeparated) {
                          handleNumericInput(e, onChange);
                        } else {
                          handleDefaultInputChange(e, onChange);
                        }
                      }}
                      value={
                        formatAsCommaSeparated
                          ? formatIndianNumber(value)
                          : value
                      }
                      disabled={disabled}
                      variant={variant}
                      {...InputConfig}
                      {...extraProps}
                      sx={{
                        border: "none !important",
                        borderBottom:
                          "1px solid rgba(0, 0, 0, 0.12) !important",
                        boxShadow: "none !important",
                        borderRadius: "0",
                        backgroundColor: "transparent",
                        px: 3,
                        "&::placeholder": {
                          color: "#3E4954",
                          opacity: "0.8",
                          fontSize: "12px",
                          fontWeight: "500",
                        },
                        "&:not(:placeholder-shown)": {
                          fontWeight: "600",
                          fontSize: "12px",
                          opacity: 0.9,
                          color: "black",
                          textTransform: "uppercase",
                        },
                        "&:hover": {
                          border: "1px solid rgba(0, 0, 0, 0.12) !important",
                          borderRadius: "6px",
                          backgroundColor: "transparent !important",
                          boxShadow: "none !important",
                        },
                        "&:focus": {
                          borderRadius: "6px",
                          border: "2px solid #2684FF !important",
                          outline: "none !important",
                        },
                      }}
                    />
                  </>
                )}

                {endIcons && (
                  <InputRightElement onClick={onIconClick} top="8%">
                    {endIcons}
                  </InputRightElement>
                )}
              </InputGroup>

              {!hideError && (
                <FormErrorMessage>{(error as any)?.message}</FormErrorMessage>
              )}
            </FormControl>
          );
        }}
      />
    </Box>
  );
});

TextInput.displayName = "TextInput";
export default TextInput;
