import moment from "moment";
import * as Yup from "yup";
import i18next from "i18next";

export const customerSchema = (t: typeof i18next.t, allAddress) => {
  return Yup.object().shape(
    {
      promiseTaken: Yup.boolean(),
      custEntityTypeId: Yup.mixed().required(t("messages.entity")),
      // constitution: Yup.mixed().required(t("messages.constitution")),
      constitution: Yup.mixed()
        .required(t("messages.constitution"))
        .test("isSelected", t("messages.constitution"), value => value !== ""),
      //salutation: Yup.mixed().test(
      title: Yup.mixed().test(
        "marital-required",
        t("messages.salutation"),
        function (value) {
          const { entityTypeFlag } = this.parent;
          if (entityTypeFlag) {
            return value
              ? true
              : this.createError({ message: t("messages.salutation") });
          }
          return true;
        }
      ),
      fName: Yup.string().required(t("messages.firstName")),
      // lName: Yup.string().required(t("messages.lastName2")),
      lName: Yup.string().when("entityTypeFlag", {
        is: true,
        then: Yup.string().required(t("messages.lastName2")),
        otherwise: Yup.string().nullable(),
      }),
      source: Yup.mixed().required(t("messages.source")),
      companyName: Yup.string().when("promiseTaken", {
        is: true,
        then: schema =>
          schema.when("pan", {
            is: (pan: any) => !!pan,
            then: Yup.string().required(t("messages.companyName")),
            otherwise: Yup.string().required(""),
          }),
        otherwise: schema => schema.nullable(),
      }),
      adhaarNumber: Yup.string()
        // .required("Aadhaar is required")
        .matches(/^$|^\d{12}$/, "Aadhaar must be 12 digits"),
      // aadhaarNumber: Yup.string()
      //   .nullable()
      //   .matches(/^$|^\d{12}$/, t("messages.aadhaar")) // Validates if it's 12 digits or empty
      //   .test((value:any) => {
      //     // Ensure that if the value is not empty, it is a valid 12-digit number
      //     if (value) {
      //       const cleanedValue = value.replace(/\D/g, "");  // Remove any non-digit characters
      //       if (cleanedValue.length === 12) {
      //         return true;  // Valid Aadhaar number
      //       }
      //       return false;  // Invalid Aadhaar number if not exactly 12 digits
      //     }
      //     return true;  // Allow empty value
      //   }),
      maritalStatus: Yup.mixed().test(
        "marital-required",
        "Marital Status is required",
        function (value) {
          const { entityTypeFlag } = this.parent;
          if (entityTypeFlag) {
            return value
              ? true
              : this.createError({ message: "Marital Status is required" });
          }
          return true;
        }
      ),
      dob: Yup.string()
        .test("dob-required", "DOB is required", function (value) {
          const { entityTypeFlag } = this.parent;
          if (entityTypeFlag && !value) {
            return this.createError({ message: "DOB is required" });
          }
          return true;
        })
        .test(
          "is-at-least-10-years-old",
          "Birthdate should be 10 years less than present date",
          function (value) {
            const { entityTypeFlag } = this.parent;

            if (!entityTypeFlag || !value) return true;

            const todaysDate = moment(new Date());
            const choosenDate = moment(value);
            const duration = moment.duration(todaysDate.diff(choosenDate));

            return duration.years() > 10
              ? true
              : this.createError({
                  message:
                    "Birthdate should be 10 years less than present date",
                });
          }
        )
        .nullable(),

      gender: Yup.mixed().test(
        "gender-required",
        "Gender is required",
        function (value) {
          const { entityTypeFlag } = this.parent;
          if (entityTypeFlag) {
            return value
              ? true
              : this.createError({ message: "Gender is required" });
          }
          return true;
        }
      ),
     pan: Yup.string().when("entityTypeFlag", {
  is: true,
  then: Yup.string()
    .required(t("PAN No. is required"))
    .transform((value) => value ? value.toUpperCase() : value) 
    .matches(
      /^[A-Z]{3}[PCHFATBLJG]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/,
      t("Please enter a valid PAN number (Format: AAAAA9999A)")
    )
    .length(10, t("PAN number must be exactly 10 characters")),
  otherwise: Yup.string(),
}),

      // industryId: Yup.mixed().test(
      //   "Industry-required",
      //   "Industry is required",
      //   function (value) {
      //     const { entityTypeFlag } = this.parent;
      //     if (entityTypeFlag) {
      //       return value
      //         ? true
      //         : this.createError({ message: "Industry is required" });
      //     }
      //     return true;
      //   }
      // ),
      // typeOfBusiness: Yup.mixed().test(
      //   "TypeOfBusiness-required",
      //   "Type of business is required",
      //   function (value) {
      //     const { entityTypeFlag } = this.parent;
      //     if (entityTypeFlag) {
      //       return value
      //         ? true
      //         : this.createError({ message: "Type of business is required" });
      //     }
      //     return true;
      //   }
      // ),
      // typeOfBusiness: Yup.mixed().when("entityTypeFlag", {
      //   is: true,
      //   then: Yup.mixed().required(t("Type of business is required")),
      //   otherwise: Yup.mixed(),
      // }),
      address: Yup.array()
        .test("residence-mandatory", function (value) {
          const { entityTypeFlag } = this.parent;

          if (!entityTypeFlag) return true;
          const residenceAddressExists = value?.some(
            addr => addr?.addressType === "1000000001"
          );

          const residenceStateFilled = value?.some(
            addr =>
              addr?.addressType === "1000000001" && addr?.state?.trim() !== ""
          );
          console.log(residenceAddressExists, residenceStateFilled, "val?");

          // if (residenceAddressExists && !residenceStateFilled) {
          //   return this.createError({
          //     message: "Residence Address is mandatory",
          //     path: this.path,
          //   });
          // }
          return true;
        })
        .test("perma-mandatory", function (value) {
          const { entityTypeFlag } = this.parent;

          if (!entityTypeFlag) return true;
          const permaAddressExists = value?.some(
            addr => addr?.addressType === "1000000002"
          );
          const permaStateFilled = value?.some(
            addr =>
              addr?.addressType === "1000000002" && addr?.state?.trim() !== ""
          );
          // if (permaAddressExists && !permaStateFilled) {
          //   return this.createError({
          //     message: "Permanent Address is mandatory",
          //     path: this.path,
          //   });
          // }
          return true;
        })
        .test("office-mandatory", function (value) {
          const { entityTypeFlag } = this.parent;
          if (entityTypeFlag) return true;

          const officeAddressExists = value?.some(
            addr => addr?.addressType === "1000000003"
          );
          const officeStateFilled = value?.some(
            addr =>
              addr?.addressType === "1000000003" && addr?.state?.trim() !== ""
          );
          if (officeAddressExists && !officeStateFilled) {
            return this.createError({
              message: "Office Address is mandatory",
              path: this.path,
            });
          }
          return true;
        })
        .required("Address field is required"),

      // ),
      // address: Yup.array()
      //   .test(
      //     "required-if-all-states-empty",
      //     "At least one address is requied",
      //     function (value) {
      //       console.log("Validation Running:", value);

      //       return !(
      //         Array.isArray(value) &&
      //         value.length > 0 &&
      //         value.every(addr => addr?.state === "")
      //       );
      //     }
      //   )
      //   .required("Address field is required"), // Ensures array presence
    },
    ["dob", "dob"],
    ["pan", "lName"],
    ["lName", "pan"]
  );
};
