import {
  createSlice,
  AsyncThunk,
  Slice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

interface CreateApiSliceHookProps<T, R extends any[]> {
  reducerKey: string;
  apiFunction: (...args: R) => AsyncThunk<T, R, AsyncThunkConfig>;
}

interface AsyncThunkConfig {
  rejectValue: {
    message: string;
  };
}

interface AsyncSliceState<T> {
  loading: boolean;
  data: Array<any> | any | T;
  error: string | null;
}

export const createApiSliceHook = <T, R extends any[]>(
  props: CreateApiSliceHookProps<T, R>
): Slice<AsyncSliceState<T>, SliceCaseReducers<AsyncSliceState<T>>, string> => {
  const { reducerKey, apiFunction } = props;

  const initialState: AsyncSliceState<T> = {
    loading: false,
    data: [],
    error: null,
  };

  const thunkAction = apiFunction();

  return createSlice({
    name: reducerKey,
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(thunkAction.pending, state => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunkAction.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        })
        .addCase(thunkAction.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "An error occurred";
        });
    },
  });
};
