import KeyvCache from "keyv-cache";

export const kvCaches = new KeyvCache({ namespace: "fe-tiya-bot" });

export const ONE_MONTH = 30 * 24 * 60 * 60 * 1e3;
export const ONE_YEAR = 365 * 24 * 60 * 60 * 1e3;

export const SPEAKER_KEY = window.location.origin + "/AZURE_SPEAKERS_";
export const USER_ID_KEY = window.location.origin + "/USER_ID";
