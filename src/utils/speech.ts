import { SpeechConfig, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { API_AZURE_TOKEN } from '../fetch/api'
const serviceRegion = "eastus";

export const getSpeechConfig = async () => {
  const token = await API_AZURE_TOKEN(serviceRegion);
  return SpeechConfig.fromAuthorizationToken(token,serviceRegion)
};

export const getSpeakers = async (locale: string) => {
  const config = await getSpeechConfig();
  return new SpeechSynthesizer(config).getVoicesAsync(locale);
};
