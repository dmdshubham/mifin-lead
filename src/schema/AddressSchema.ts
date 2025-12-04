import * as Yup from "yup";
import i18next from "i18next";

const AddressSchema = (t: typeof i18next.t, addressType: string) => {
  return Yup.object().shape({
    // mobile_no1: Yup.string()
    //   .required(t("messages.mobileNo1"))
    //   .matches(/^\d{10}$/, t("messages.mobileNoInvalid")),

    address: Yup.string().required(t("messages.address1")),
    company_name:
      addressType === "1000000003"
        ? Yup.string().required(t("messages.companyName"))
        : Yup.string().notRequired(),
    state: Yup.mixed().test(
      "state-required",
      "State is required",
      function (value) {
        return value?.value
          ? true
          : this.createError({ message: "State is required" });
      }
    ),
    // city: Yup.mixed().test(
    //   "City-required",
    //   "City is required",
    //   function (value) {
    //     return value?.value
    //       ? true
    //       : this.createError({ message: "City is required" });
    //   }
    // ),
    city: Yup.mixed().test(
      "District-required",
      "District is required",
      function (value) {
        return value?.value
          ? true
          : this.createError({ message: "District is required" });
      }
    ),
    zipcode: Yup.mixed().test(
      "Pincode-required",
      "Pincode is required",
      function (value) {
        return value?.value
          ? true
          : this.createError({ message: "Pincode is required" });
      }
    ),
    locality: Yup.mixed().test(
      "Tehsil-required",
      "Tehsil is required",
      function (value) {
        return value?.value
          ? true
          : this.createError({ message: "Tehsil is required" });
      }
    ),
  });
};

export default AddressSchema;
