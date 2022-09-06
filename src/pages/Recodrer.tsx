import { desktopCapturer } from 'electron';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  AddCameraDeviceBtn,
  // AddMicBtn,
  AddScreenBtn,
  DevicePickerBtn,
  SelectDeviceOptionBtn,
} from '../components/buttons';
import { CenteredRow } from '../components/grid';
import { H1 } from '../components/headers';
import { Background } from '../components/layout';
import {
  ScreenCameraRecorder,
  WebCameraRecorder,
} from '../components/recorderCamera';

const CamerasHolder = styled.div`
  display: flex;
  justify-content: center;
`;

const ConfigurationHolder = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

const AddConfigView = styled.div`
  display: flex;
  height: 70vh;
  ${({ isReverse }) =>
    isReverse
      ? `
    flex-direction: column-reverse;
  `
      : `
  flex-direction: column;
  `}
`;

export const RecordType = { camera: 'camera', screen: 'screen' };

export const GetVideoInputDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices
    .filter((device) => device.kind === 'videoinput')
    .map(({ label, deviceId }) => ({
      cameraName: label,
      deviceID: deviceId,
      type: RecordType.camera,
    }));
  const screenRecordinOptions = await desktopCapturer.getSources({
    types: ['window', 'screen'],
  });
  videoDevices.push(
    ...screenRecordinOptions.map((opt) => {
      return {
        deviceID: opt.id,
        cameraName: opt.name,
        type: RecordType.screen,
      };
    })
  );
  return videoDevices;
};

export interface Camera {
  deviceID: string;
  cameraName: string;
  type: string;
}

const NewRecord = () => {
  const [recordingCameras, setRecordingCameras] = useState([] as Camera[]);
  const [cameras, setCameras] = useState([] as Camera[]);
  const [isClicked, setClicked] = useState(false);
  const [deviceOptions, setDeviceOptions] = useState([] as Camera[]);
  const [screenRecOptions, setScreenRecOptions] = useState([] as Camera[]);
  useEffect(() => {
    async function getDeviceID() {
      const IDs = await GetVideoInputDevices();
      setRecordingCameras(IDs);
      const screenRecordinOptions = await desktopCapturer.getSources({
        types: ['window', 'screen'],
      });
      setScreenRecOptions(
        screenRecordinOptions.map((opt) => {
          return {
            deviceID: opt.id,
            cameraName: opt.name,
            type: RecordType.screen,
          };
        })
      );
    }
    getDeviceID();
  }, []);

  const addCamera = (camera: Camera) => {
    const currentCams = cameras;
    currentCams.push(camera);
    setCameras(currentCams);
  };

  const removeCamera = (id) => {
    const cameraList = cameras.filter(({ deviceID }) => deviceID !== id);
    setCameras(cameraList);
  };

  return (
    <Background>
      <H1 center>Hello records</H1>
      <AddConfigView isReverse={cameras.length === 0}>
        <CamerasHolder>
          {cameras.length > 0 &&
            cameras.map((cam) =>
              cam.type === RecordType.camera ? (
                <WebCameraRecorder {...cam} onRemove={removeCamera} />
              ) : (
                <ScreenCameraRecorder {...cam} onRemove={removeCamera} />
              )
            )}
        </CamerasHolder>
        <ConfigurationHolder>
          {isClicked && (
            <CenteredRow>
              <AddCameraDeviceBtn
                onClick={() => setDeviceOptions(recordingCameras)}
              />
              <AddScreenBtn
                onClick={() => {
                  setDeviceOptions(screenRecOptions);
                }}
              />
            </CenteredRow>
          )}
          <CenteredRow>
            {deviceOptions.length > 0 &&
              deviceOptions.map((camera) => {
                return (
                  <SelectDeviceOptionBtn
                    key={camera.deviceID}
                    label={camera.cameraName}
                    {...camera}
                    onClick={() => {
                      addCamera(camera);
                    }}
                  />
                );
              })}
          </CenteredRow>
        </ConfigurationHolder>
      </AddConfigView>
      <DevicePickerBtn
        isClicked={isClicked}
        onClick={() => setClicked(!isClicked)}
      >
        +
      </DevicePickerBtn>
    </Background>
  );
};

export default NewRecord;
