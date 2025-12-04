interface initialState {
  data: Array<any> | null;
  isLoading: boolean;
  isError: string | boolean | null;
  errorMessage: string;
}

export const INITIAL_STATE: initialState = {
  data: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};
