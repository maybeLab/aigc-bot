import KeyvCache from "keyv-cache";

const kvCaches_ = new KeyvCache({ namespace: "aigc-bot" });

export const kvCaches = new Proxy(kvCaches_, {
  get: (target, prop) => {
    if (window.location.protocol.includes("https")) {
      return Reflect.get(target, prop);
    } else {
      return ()=>{};
    }
  },
});

export const ONE_MONTH = 30 * 24 * 60 * 60 * 1e3;
export const ONE_YEAR = 365 * 24 * 60 * 60 * 1e3;

export const SPEAKER_KEY = window.location.origin + "/AZURE_SPEAKERS_";
export const USER_ID_KEY = window.location.origin + "/USER_ID";
