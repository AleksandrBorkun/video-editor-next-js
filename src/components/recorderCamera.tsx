import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import fs from 'fs';

import styled from 'styled-components';

const RemoveCameraBtn = styled.button``;

const VideoHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin: 10px;
  .player {
    width: 100% !important;
    height: 100% !important;
  }
`;

const RecPlayerControl = styled.div`
  justify-content: space-evenly;
  display: flex;
`;

const cameraConstrains = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
  },
  audio: true,
};

const screenConstrains = (id) => {
  return {
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
      },
    },
    audio: false,
  };
};

const saveFile = async (chunks, cameraName) => {
  const blob = new Blob(chunks, {
    type: 'video/webm',
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  fs.writeFile(`${cameraName}2343.webm`, buffer, () =>
    console.log('video saved!')
  );
};

const GenericCameraRecorder = ({
  deviceID,
  cameraName,
  onRemove,
  constrains,
}) => {
  const [webcamStream, setStream] = useState(new MediaStream());
  const [recorder, setRecorder] = useState({} as MediaRecorder);
  useEffect(() => {
    async function getStream() {
      const web = await navigator.mediaDevices.getUserMedia({
        ...constrains,
      });
      setStream(web);
      const rec = new MediaRecorder(web);
      rec.ondataavailable = async (blob) => {
        await saveFile([blob.data], cameraName);
      };
      setRecorder(rec);
    }
    getStream();
  }, []);

  return (
    <VideoHolder>
      {onRemove && (
        <RemoveCameraBtn onClick={() => onRemove(deviceID)}>-</RemoveCameraBtn>
      )}
      {webcamStream.active && (
        <ReactPlayer className="player" url={webcamStream} muted playing />
      )}
      {/* <RecPlayerControl> */}
      {/* <Button onClick={() => recorder.start()}>Record</Button>
        <Button>Pause</Button>
        <Button
          onClick={() => {
            recorder.requestData();
            recorder.stop();
          }}
        >
          Stop
        </Button> */}
      {/* </RecPlayerControl> */}
    </VideoHolder>
  );
};

export const ScreenCameraRecorder = (props) => {
  return GenericCameraRecorder({
    ...props,
    constrains: screenConstrains(props.deviceID),
  });
};

export const WebCameraRecorder = (props) => {
  return GenericCameraRecorder({ ...props, constrains: cameraConstrains });
};
