import React, { useEffect } from 'react';
import { Camera } from './Recodrer';

let recognition = {} as webkitSpeechRecognition;

const recognitionOfSpeech = (
  configs = [] as IConfig[],
  onMatch = (word) => console.log(`match ${word}`)
) => {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'ru-RU';

  recognition.onresult = function (event) {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        interimTranscript = '';
      } else {
        console.log(`single word is ${event.results[i][0].transcript}`);
        interimTranscript += event.results[i][0].transcript;
      }
    }
    console.log(interimTranscript);
    // eslint-disable-next-line no-restricted-syntax
    for (const config of configs) {
      if (
        interimTranscript.toLowerCase().indexOf(config.keyWord.toLowerCase())
      ) {
        onMatch(config.keyWord);
        break;
      }
    }
  };
};

const RecordWithConfog = ({ config = [] as IConfig | any }) => {
  return (
    <div>
      {JSON.stringify(config)}
      <button
        type="button"
        onClick={() => {
          console.log('Start clicked');
          recognitionOfSpeech(config);
        }}
      >
        Init
      </button>
      <button
        type="button"
        onClick={() => {
          console.log('Start clicked');
          recognition.start();
        }}
      >
        Start
      </button>
      <button
        type="button"
        onClick={() => {
          console.log('Stop clicked');
          recognition.stop();
        }}
      >
        Stop
      </button>
    </div>
  );
};

export interface IConfig {
  cameras: Camera[];
  keyWord: string;
  viewType: string;
  isDefault: boolean;
}

export default RecordWithConfog;
