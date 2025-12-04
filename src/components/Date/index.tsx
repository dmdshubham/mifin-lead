import "react-datepicker/dist/react-datepicker.css";
import { Box, Button, HStack, Input, Select } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { FC, forwardRef } from "react";
import { useDatepickerStyles } from "@mifin/components/Date/Styles";
import { IDateRangeProps } from "@mifin/Interface/myWorklist";
import { sanitizedInput } from "@mifin/utils/sanitizedInput";

const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const DateRange: FC<IDateRangeProps> = props => {
  const { date, placeholder, setDate, showYear, showMonth, ...args } = props;
  const getYear = (date: Date) => date.getFullYear();
  // const getMonthName = (date: Date) =>
  //   new Date(date).toLocaleDateString("default", { month: "long" });
  const getMonthNumber = (date: Date) => {
    return new Date(date).getMonth() + 1;
  };
  const styles = useDatepickerStyles({});
  const years = Array.from({ length: 2100 - 1920 }, (_, index) => index + 1920);

  return (
    // <Box sx={styles} zIndex={999}>
    //   {/* <Calender
    //     style={{
    //       position: "absolute",
    //       fontSize: "21px",
    //       marginLeft: "5px",
    //       marginTop: "10px",
    //       paddingRight: "5px",
    //     }}
    //   /> */}
    //   <DatePicker
    //     showYearDropdown
    //     dateFormat="dd-MMM-yyyy"
    //     showMonthDropdown
    //     placeholderText={placeholder}
    //     renderCustomHeader={({
    //       date,
    //       decreaseMonth,
    //       increaseMonth,
    //       prevMonthButtonDisabled,
    //       nextMonthButtonDisabled,
    //       changeYear,
    //       changeMonth,
    //     }) => (
    //       <HStack mx={3} my={1}>
    //         {/* <Text
    //           color="gray.700"
    //           fontWeight="semibold"
    //           fontSize="sm"
    //           minW={20}
    //         >
    //           {getMonthName(date)}
    //         </Text> */}
    //         {/* <Text color="gray.700" fontWeight="semibold" fontSize="sm">
    //           {getYear(date)}
    //         </Text> */}
    //         {showYear && (
    //           <Select
    //             onChange={e => {
    //               changeYear(parseInt(e.target.value));
    //             }}
    //             value={getYear(date)}
    //             fontSize="10px"
    //           >
    //             <>
    //               {years.map(item => {
    //                 return <option key={item}>{item}</option>;
    //               })}
    //             </>
    //           </Select>
    //         )}
    //         {showMonth && (
    //           <Select
    //             onChange={e => {
    //               changeMonth(parseInt(e.target.value) - 1);
    //             }}
    //             value={getMonthNumber(date)}
    //             fontSize="12px"
    //           >
    //             <>
    //               {months.map((item, i) => {
    //                 return (
    //                   <option value={item.value} key={i}>
    //                     {item.label}
    //                   </option>
    //                 );
    //               })}
    //             </>
    //           </Select>
    //         )}
    //         <Button
    //           variant="link"
    //           minW={3}
    //           onClick={decreaseMonth}
    //           disabled={prevMonthButtonDisabled}
    //         >
    //           {"<"}
    //         </Button>

    //         <Button
    //           variant="link"
    //           minW={3}
    //           onClick={increaseMonth}
    //           disabled={nextMonthButtonDisabled}
    //         >
    //           {">"}
    //         </Button>
    //       </HStack>
    //     )}
    //     {...args}
    //     selected={date}
    //     onChange={setDate}
    //     customInput={<DatePickerInput />}
    //     // onSelect={setDate}
    //   />
    // </Box>
    <Box sx={styles} zIndex={999}>
      {/* <Calender
        style={{
          position: "absolute",
          fontSize: "21px",
          marginLeft: "5px",
          marginTop: "10px",
          paddingRight: "5px",
        }}
      /> */}
      <DatePicker
        showYearDropdown
        dateFormat="dd-MMM-yyyy"
        showMonthDropdown
        placeholderText={placeholder}
        popperClassName="some-custom-class"
        popperPlacement="top-end"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [5, 10],
            },
          },
          {
            name: "preventOverflow",
            options: {
              rootBoundary: "viewport",
              tether: false,
              altAxis: true,
            },
          },
        ]}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
          changeYear,
          changeMonth,
        }) => (
          <HStack mx={1} my={1}>
            {/* <Text
              color="gray.700"
              fontWeight="semibold"
              fontSize="sm"
              minW={20}
            >
              {getMonthName(date)}
            </Text> */}
            {/* <Text color="gray.700" fontWeight="semibold" fontSize="sm">
              {getYear(date)}
            </Text> */}
            {showYear && (
              <Select
                onChange={e => {
                  changeYear(parseInt(e.target.value));
                }}
                value={getYear(date)}
                fontSize={14}
              >
                <>
                  {years.map(item => {
                    return <option key={item}>{item}</option>;
                  })}
                </>
              </Select>
            )}
            {showMonth && (
              <Select
                onChange={e => {
                  changeMonth(parseInt(e.target.value) - 1);
                }}
                value={getMonthNumber(date)}
                // value={getMonthName(date)}
              >
                <>
                  {months.map((item, i) => {
                    return (
                      <option value={item.value} key={i}>
                        {item.label && item.label?.slice(0, 3)}
                      </option>
                    );
                  })}
                </>
              </Select>
            )}

            <Button
              variant="link"
              minW={3}
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              {"<"}
            </Button>

            <Button
              variant="link"
              minW={3}
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              {">"}
            </Button>
          </HStack>
        )}
        {...args}
        selected={date}
        onChange={setDate}
        customInput={<DatePickerInput />}
        // onSelect={setDate}
      />
    </Box>
  );
};

const DatePickerInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
>(({ value = "", onClick, onChange }, ref) => (
  <Input
    className="datepicker-input"
    ref={ref}
    value={value}
    onClick={onClick}
    onChange={e => {
      const sanitized = sanitizedInput(e.target.value);
      onChange?.({ ...e, target: { ...e.target, value: sanitized } });
    }}
  />
));

DatePickerInput.displayName = "DatePickerInput";
export default DateRange;
