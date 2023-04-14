import {
  SpeechSynthesizer,
  ResultReason,
  SpeakerAudioDestination,
  AudioConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import { getSpeechConfig } from "../../utils/speech";

let isPlayingAudio: null | SpeakerAudioDestination = null;

async function tts(text: string) {
  if (isPlayingAudio) {
    isPlayingAudio.pause();
    isPlayingAudio.close();
    isPlayingAudio = null;
  }
  const speechConfig = await getSpeechConfig();
  const { speaker, speakerStyle } = window._GLOBAL_SETTINGS;
  const dest = new SpeakerAudioDestination();

  isPlayingAudio = dest;
  dest.onAudioEnd = (sender) => {
    isPlayingAudio = null
  };
  const audioConfig = AudioConfig.fromSpeakerOutput(dest);
  // Create the speech synthesizer.
  let synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
  // Start the synthesizer and wait for a result.
  synthesizer.speakSsmlAsync(
    `<speak
      xmlns="http://www.w3.org/2001/10/synthesis"
      xmlns:mstts="http://www.w3.org/2001/mstts"
      xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
      <voice name="${speaker}">
        <mstts:express-as style="${speakerStyle}" >
          <prosody rate="+20.00%" pitch="0%">${text}</prosody>
        </mstts:express-as>
      </voice>
    </speak>`,
    function (result) {
      if (result.reason === ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error(
          "Speech synthesis canceled, " +
            result.errorDetails +
            "\nDid you set the speech resource key and region values?"
        );
      }
      synthesizer.close();
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
    }
  );
}
export default tts;
