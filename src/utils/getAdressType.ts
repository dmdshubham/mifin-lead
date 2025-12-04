const getAdressType = (addressLabel: string) => {
    if (addressLabel && typeof addressLabel === "string") {
        if (addressLabel.toLowerCase() === "permanent address") {
            return "1000000002";
        } else if (addressLabel.toLowerCase() === "residence address") {
            return "1000000001";
        } else if (addressLabel.toLowerCase() === "office address") {
            return "1000000003";
        }
    }
}

export default getAdressType;