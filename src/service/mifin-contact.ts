import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const DunningKey = "dunning";
const getDunning = (body: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(api.dunning, body);
  return result.data;
};

const useDunningMutation = (info: any) => {
  return useQuery(api.dunning, getDunning(info), {
    enabled: !!info,
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const useDunningList = () => {
  return useQuery<any>(DunningKey);
};

const DunningTemplateKey = "dunning-template";
const getDunningTemplate = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(api.dunning, body);
  return result.data;
};

const useDunningTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(getDunningTemplate, {
    onSuccess: result => {
      queryClient.setQueryData(DunningTemplateKey, result.responseData);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const useTemplateList = () => {
  return useQuery(DunningTemplateKey);
};

const getDunningTemplateList = (body: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.dunningTemplateList,
    body
  );
  return result.data;
};

const useGetDunningTemplateList = (templateType: string) => {
  const queryClient = useQueryClient();

  return useQuery(
    api.dunningTemplateList,
    getDunningTemplateList(templateType),
    {
      enabled: !!templateType,
      onSuccess: result => {
        queryClient.setQueryData(DunningTemplateKey, result.responseData);
      },
      onError: () => {
        toastFail("Something went wrong");
      },
    }
  );
};

const DunningTemplateTextKey = "dunning-templatetext";
const getDunningTemplateText = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.dunningTemplateText,
    body
  );
  return result.data;
};

const useDunningTemplateTextMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(getDunningTemplateText, {
    onSuccess: result => {
      queryClient.setQueryData(DunningTemplateTextKey, result.responseData);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const DunningSaveKey = "dunning-save";
const getDunningSave = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.dunningSave,
    body
  );
  return result.data;
};

const useDunningSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(getDunningSave, {
    onSuccess: result => {
      queryClient.setQueryData(DunningSaveKey, result.responseData);
      queryClient.refetchQueries({
        queryKey: api.dunning,
      });
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

export {
  useDunningMutation,
  useDunningList,
  useDunningTemplateMutation,
  useTemplateList,
  useDunningTemplateTextMutation,
  useDunningSaveMutation,
  useGetDunningTemplateList,
};
