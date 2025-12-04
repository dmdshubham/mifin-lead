const shortener = (string: string) => {
  if (string?.length > 50) {
    string = string.substring(0, 65) + "...";
  }
  return string;
};

export default shortener;
