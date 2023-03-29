import { memo, useState, useEffect } from "react";
import { VoiceInfo } from "microsoft-cognitiveservices-speech-sdk";
import { getSpeakers } from "../../utils/speech";

export default memo(function Settings() {
  const [locale, setLocale] = useState("en-US");
  const [speaker, setSpeaker] = useState(-1);
  const [speakerStyle, setSpeakerStyle] = useState("");

  const [speakList, setSpeakers] = useState<VoiceInfo[]>([]);

  useEffect(() => {
    getSpeakers(locale).then((e) => {
      setSpeakers(e.voices);
      setSpeaker(0);
      setSpeakerStyle(e.voices[0].styleList[0] || "");
    });
  }, [locale]);

  useEffect(() => {
    window._GLOBAL_SETTINGS = {
      locale,
      speaker: speakList[speaker]?.shortName,
      speakerStyle,
    };
  }, [locale, speaker, speakerStyle, speakList]);

  return (
    <fieldset className="globalSetting">
      <legend>Speaker(bot) Setting</legend>
      <label htmlFor="locale">
        locale:
        <select name="" id="locale" onChange={(e) => setLocale(e.target.value)}>
          <option value="en-US">en-US</option>
          <option value="zh-CN">zh-CN</option>
        </select>
      </label>
      <br />
      <br />
      <label htmlFor="speaker">
        speaker:
        <select
          name=""
          id="speaker"
          onChange={(e) => {
            setSpeaker(parseInt(e.target.value));
            setSpeakerStyle(speakList[parseInt(e.target.value)]?.styleList[0]);
          }}
          disabled={speakList.length === 0}
          value={speaker}
        >
          {speakList.map((e, index) => {
            return (
              <option value={index} key={index}>
                {e.localName}
              </option>
            );
          })}
        </select>
      </label>
      <br />
      <br />
      <label htmlFor="styles">
        styles:
        <select
          name=""
          id="styles"
          onChange={(e) => setSpeakerStyle(e.target.value)}
          value={speakerStyle}
          disabled={speaker === -1 || !speakList[speaker]?.styleList.length}
        >
          {speakList[speaker]?.styleList.map((name) => {
            return (
              <option value={name} key={name}>
                {name}
              </option>
            );
          })}
        </select>
      </label>
    </fieldset>
  );
});
