import {
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { BLUE_PRIMARY, DARK_PRIMARY, GREY_LIGHT } from '../components/colors';
import { H1 } from '../components/headers';
import { Background } from '../components/layout';
import {
  ScreenCameraRecorder,
  WebCameraRecorder,
} from '../components/recorderCamera';
import { Camera, GetVideoInputDevices, RecordType } from './Recodrer';

const SetViewFormHolder = styled.form`
  width: 50%;
`;

const SetViewFormWrapper = styled.div`
  background-color: ${GREY_LIGHT};
  min-height: 800px;
  display: flex;
  border: 4px solid ${BLUE_PRIMARY};
  border-radius: 10px;
  align-items: end;
`;

const CamerasPreview = styled.div`
  display: flex;
  width: 50%;
`;

const NoPreview = styled.div`
  color: burlywood;
  font-size: 1.5rem;
  border: 1px solid coral;
  border-radius: 10px;
  text-align: center;
  margin: auto;
`;

const DefaultInputHoler = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;

  #dropDownLabel {
    min-width: 200px;
    color: ${DARK_PRIMARY};
    margin: 10px;
  }

  #textField {
    color: ${DARK_PRIMARY};
    margin: 10px;
    min-width: 300px;
  }
  #selectDropDown {
    color: ${DARK_PRIMARY};
    border: 1px solid;
    border-radius: 5px;
    min-width: 300px;
  }
`;

const MultiSelectionHolder = styled.div`
  display: flex;
  #multiSelectionLabel {
    min-width: 200px;
    color: white;
    margin: 10px;
  }
`;

const MultiCheckboxHolder = styled(DefaultInputHoler)`
  flex-direction: column;
  align-items: baseline;
  width: 50%;
`;

const ViewTypes = [{ value: 'Single' }, { value: 'Multiple' }];

const ControllButtons = styled.div`
  margin-top: 300px;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-around;
`;

const MultiSelectionField = ({
  items,
  valueKey,
  nameKey,
  placeholder,
  onValueChanged,
}) => {
  const [checkedItems, setChecked] = useState({});
  const handleChange = (value) => {
    const checkedStates = checkedItems;
    checkedStates[value] = !checkedStates[value];
    setChecked(checkedStates);
    onValueChanged(checkedStates);
  };

  return (
    <MultiSelectionHolder>
      <InputLabel id="multiSelectionLabel"> {placeholder}</InputLabel>
      <MultiCheckboxHolder>
        {items.map((item) => (
          <FormControlLabel
            key={item[valueKey]}
            control={
              <Checkbox
                checked={checkedItems[item[valueKey]]}
                onChange={() => handleChange(item[valueKey])}
                name={item[nameKey]}
                color="primary"
              />
            }
            label={item[nameKey]}
          />
        ))}
      </MultiCheckboxHolder>
    </MultiSelectionHolder>
  );
};

const DropDown = ({
  placeholder,
  items,
  valueKey,
  nameKey,
  onValueChanged,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, selectItem] = useState('');
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    selectItem(event.target.value as string);
    if (onValueChanged) {
      onValueChanged(event.target.value as string);
    }
  };
  return (
    <DefaultInputHoler>
      <InputLabel id="dropDownLabel">{placeholder}</InputLabel>
      <Select
        // labelId="demo-controlled-open-select-label"
        id="selectDropDown"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={selectedItem}
        onChange={handleChange}
        autoWidth={false}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {items.map((item) => (
          <MenuItem key={item[valueKey]} value={item[valueKey]}>
            {item[nameKey]}
          </MenuItem>
        ))}
      </Select>
    </DefaultInputHoler>
  );
};

const InputField = ({ placeholder, label, onValueChanged }) => {
  const [value, setValue] = useState('');

  return (
    <DefaultInputHoler>
      <InputLabel id="dropDownLabel">{placeholder}</InputLabel>
      <TextField
        onChange={(event) => {
          setValue(event.target.value);
          onValueChanged(value);
        }}
        id="textField"
        required
        label={label}
        variant="outlined"
        value={value}
      />
    </DefaultInputHoler>
  );
};

const SingleCameraPreview = ({ camera = {} as Camera }) => {
  return camera.type === RecordType.camera ? (
    <WebCameraRecorder {...camera} />
  ) : (
    <ScreenCameraRecorder {...camera} />
  );
};

const SetView = ({ isDefault, onViewAdded, onFormSubmit }) => {
  const [recordingCameras, setRecordingCameras] = useState([] as Camera[]);
  const [viewType, setViewType] = useState(ViewTypes[0].value);
  const [activeCamera, setActiveCamera] = useState({} as Camera);
  const [activeCameras, setActiveCameras] = useState({});
  const [keyword, setKeyWord] = useState('');
  useEffect(() => {
    async function getDeviceID() {
      const IDs = await GetVideoInputDevices();
      setRecordingCameras(IDs);
    }
    getDeviceID();
  }, []);

  const handleAddView = (event) => {
    if (event) event.preventDefault();
    let isAdded = false;
    if (viewType === ViewTypes[0].value) {
      const singleView = {
        cameras: [activeCamera],
        keyWord: keyword,
        viewType: 'single',
        isDefault,
      };
      isAdded = onViewAdded(singleView);
    } else {
      const multiView = {
        cameras: recordingCameras.filter(
          ({ deviceID }) => Object.keys(activeCameras).indexOf(deviceID) !== -1
        ),
        keyWord: keyword,
        viewType: 'multiple',
        isDefault,
      };
      isAdded = onViewAdded(multiView);
    }
    if (!isAdded) alert('Duplicated Keyword!');
    if (event) onFormSubmit();
  };
  return (
    <SetViewFormWrapper>
      <SetViewFormHolder onSubmit={handleAddView}>
        <DropDown
          onValueChanged={setViewType}
          placeholder="Source Type"
          items={ViewTypes}
          valueKey="value"
          nameKey="value"
        />

        {recordingCameras.length > 0 && viewType === ViewTypes[0].value && (
          <DropDown
            onValueChanged={(cameraId) =>
              setActiveCamera(
                recordingCameras.filter(
                  ({ deviceID }) => deviceID === cameraId
                )[0]
              )
            }
            placeholder="Video Source"
            items={recordingCameras}
            valueKey="deviceID"
            nameKey="cameraName"
          />
        )}

        {recordingCameras.length > 0 && viewType === ViewTypes[1].value && (
          <MultiSelectionField
            onValueChanged={setActiveCameras}
            placeholder="Select Video Sources"
            items={recordingCameras}
            valueKey="deviceID"
            nameKey="cameraName"
          />
        )}
        <InputField
          onValueChanged={setKeyWord}
          placeholder="Activate Command"
          label="Set Keyword (e.g. main camera)"
        />
        <ControllButtons>
          <button type="button" onClick={() => handleAddView(null)}>
            Add Keyword
          </button>
          <button type="submit">Submit</button>
        </ControllButtons>
      </SetViewFormHolder>
      {recordingCameras.length > 0 && (
        <CamerasPreview>
          {viewType === ViewTypes[0].value ? (
            activeCamera.deviceID && (
              <SingleCameraPreview camera={activeCamera} />
            )
          ) : (
            <NoPreview>
              No Preview Availiable for Multiple Video Sources yet.
              <br /> All selected cameras will Fit into view port together.
            </NoPreview>
          )}
        </CamerasPreview>
      )}
    </SetViewFormWrapper>
  );
};

const NewProject = ({ passConfig }) => {
  const router = useHistory();
  const [header, setHeader] = useState('Set Default View');
  const [configIndex, setConfigIndex] = useState(1);
  const [config, setConfig] = useState([] as any[]);
  const [isDefaultView, setIsDefault] = useState(true);

  const handleAddView = (newConfig: any) => {
    if (
      config.length > 0 &&
      config.map((it) => it.keyWord).indexOf(newConfig.keyWord) !== -1
    ) {
      return false;
    }
    setConfigIndex(configIndex + 1);
    setHeader(`Set ${configIndex} view`);
    setIsDefault(false);
    const currentConfig = config;
    currentConfig.push(newConfig);
    setConfig(currentConfig);
    return true;
  };

  const handleSubmit = () => {
    passConfig(config);
    router.push('/record');
  };
  return (
    <Background>
      <H1 center>{header}</H1>
      <SetView
        isDefault={isDefaultView}
        onViewAdded={handleAddView}
        onFormSubmit={handleSubmit}
      />
    </Background>
  );
};

export default NewProject;
