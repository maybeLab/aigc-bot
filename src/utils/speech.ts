import {
  SpeechConfig,
  SpeechSynthesizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";

import { API_AZURE_TOKEN } from "../fetch/api";
import { kvCaches, SPEAKER_KEY, ONE_MONTH } from "@/fetch/caches";

export * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
export * from "microsoft-cognitiveservices-speech-sdk";

const serviceRegion = "southeastasia";

export const transformAzureObject: any = (object: any) => {
  if (typeof object !== "object") return object;
  if (Array.isArray(object)) {
    return object.map(transformAzureObject);
  } else {
    return Object.fromEntries(
      Object.entries(object).map(([key, val]) => {
        return [
          key.replace(/priv(\D)/, (_, firstLetter) =>
            firstLetter.toLowerCase(firstLetter)
          ),
          transformAzureObject(val),
        ];
      })
    );
  }
};

export const getSpeechConfig = async () => {
  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  return speechConfig;
};

export const getSpeakers = async (locale: string) => {
  const config = await getSpeechConfig();
  return new SpeechSynthesizer(config).getVoicesAsync(locale);
};
