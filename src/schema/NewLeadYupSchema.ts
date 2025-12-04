import moment from "moment";
import * as Yup from "yup";
import i18next from "i18next";

const newLeadSchema = (t: typeof i18next.t, allAddress) => {
  return Yup.object().shape(
    {
      promiseTaken: Yup.boolean(),
      entityType: Yup.mixed().required(t("messages.entity")),
      constitution: Yup.mixed().required(t("messages.constitution")),
      // mobileNo: Yup.string().required(t("messages.mobileNo1")), //temporory commented as mob no1 could not found in UI
      companyName: Yup.string().when("promiseTaken", {
        is: true,
        then: schema => schema.required(t("messages.companyName")),
        otherwise: schema => schema.nullable(),
      }),
      firstName: Yup.string().when("promiseTaken", {
        is: false,
        then: schema => schema.required(t("messages.firstName")),
        otherwise: schema => schema.nullable(),
      }),
      lastName: Yup.string().when("promiseTaken", {
        is: false,
        then: schema => schema.required(t("messages.lastName2")),
        otherwise: schema => schema.nullable(),
      }),
      allocateTo: Yup.mixed().required(t("messages.allocate")),
      campaign: Yup.mixed().required(t("messages.campaign")),
      source: Yup.mixed().required(t("messages.source")),
      queueId: Yup.mixed().required(t("messages.product")),
      subQueueId: Yup.mixed().required(t("messages.potential")),
      loanAmount: Yup.string()
        .required(t("messages.loanAmount")),
      scheme: Yup.mixed().required(t("messages.schemeId")),
      pan: Yup.string().when(["promiseTaken", "lastName"], {
        is: (promiseTaken, lastName) => promiseTaken === false && lastName,
        then: Yup.string()
          .required(t("messages.pan"))
          .matches(/^$|^[A-Za-z]{5}\d{4}[A-Za-z]$/, t("messages.validPan"))
          .test("match", t("messages.pan"), function (value) {
            const lastName = this.parent.lastName;
            if (value) {
              return (
                value[4].toString().toLowerCase() ===
                lastName.charAt(0)?.toLowerCase()
              );
            }
            return true;
          })
          .test("match", t("messages.panValid"), function (value) {
            if (value) {
              return value[3].toString().toLowerCase() === "p";
            }
            return true;
          }),
        otherwise: Yup.string().nullable(),
      }),

      // adhaarNumber: Yup.string()
      //   .nullable()
      //   .matches(/^$|^\d{12}$/, t("messages.aadhaar")),
      adhaarNumber: Yup.string()
        .nullable()
        .matches(/^$|^\d{12}$/, t("messages.aadhaar")), // Validates if it's 12 digits or empty
      // .test((value:any) => {
      //   // Ensure that if the value is not empty, it is a valid 12-digit number
      //   if (value) {
      //     const cleanedValue = value.replace(/\D/g, "");  // Remove any non-digit characters
      //     if (cleanedValue.length === 12) {
      //       return true;  // Valid Aadhaar number
      //     }
      //     return false;  // Invalid Aadhaar number if not exactly 12 digits
      //   }
      //   return true;  // Allow empty value
      // }),
      dob: Yup.string().when("dob", {
        is: (dateFieldValue: any) =>
          dateFieldValue !== null && dateFieldValue !== undefined,
        then: Yup.string().test(
          "is-at-least-10-years-old",
          t("messages.dob"),
          function (value: any) {
            const todaysDate = moment(new Date());
            const choosenDate = moment(value);
            const duration = moment.duration(todaysDate.diff(choosenDate));
            if (duration.years() > 10) {
              return true;
            } else {
              return false;
            }
          }
        ),
        otherwise: Yup.string().nullable(),
      }),
      // isEmailAvailable: Yup.boolean().when("emailArray", {
      //   is: (value: any) => !value.length,
      //   then: schema => schema.required("Email is required"),
      //   otherwise: schema => schema,
      // }),
      // address: Yup.array()
      //   .nullable()
      //   .default([])
      //   .test("residence-office-mandatory", function (value) {
      //     if (!Array.isArray(value)) {
      //       return this.createError({
      //         message: "Address must be an array",
      //         path: this.path,
      //       });
      //     }
      //     console.log("allAddress:", allAddress);
      //     // Check if the Residence Address Type (1000000002) exists
      //     const residenceAddress = value.find(
      //       addr => addr?.addressType === "1000000002"
      //     );

      //     if (residenceAddress) {
      //       // Check if state is empty or missing
      //       if (
      //         !residenceAddress.state ||
      //         residenceAddress.state.trim() === ""
      //       ) {
      //         return this.createError({
      //           message: "Residence Address is mandatory",
      //           path: this.path,
      //         });
      //       }
      //     }

      //     return true; // Validation passed
      //   })
      //   .required("Residence Address is mandatory"),
      mobileArray: Yup.array()
        .min(1, t("Mobile no is required"))
        .test("has-mobile", t("Mobile no is required"), function (value) {
          return value && value.length > 0;
        }),
      emailArray: Yup.array()
        .min(1, t("Email is required"))
        .test("has-email", t("Email is required"), function (value) {
          return value && value.length > 0;
        }),
    },

    ["dob", "dob"]
  );
};

export default newLeadSchema;
