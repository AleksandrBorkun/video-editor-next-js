import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GREY_DARK, GREY_LIGHT } from './colors';

export const DevicePickerBtn = styled.button`
  padding: 30px 80px;
  font-size: 120px;
  background: ${GREY_LIGHT};
  color: #283540;
  position: absolute;
  bottom: 300px;
  margin: 10px 45%;
  transition: bottom 1s, padding 1s, font-size 1s, background 1s;
  ${({ isClicked }) =>
    isClicked &&
    `
    display: none;
    bottom: 90px;
    font-size: 80px;
    padding: 10px 40px;
    background: ${GREY_DARK}
  `}
`;

const ChooseDeviceBtn = styled.button`
  z-index: 20;
`;

const DeviceOptionBtn = styled.button`
  z-index: 20;
`;

const MainMenuOptionBtn = styled.label`
  background-color: white;
  margin: 10px;
  padding: 40px;
  border-radius: 10px;

  a {
    color: black;
  }
`;

const HomeBtnHolder = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
`;

export const Button = styled.button``;

const MainOption = ({ url, text }) => {
  return (
    <MainMenuOptionBtn>
      <Link to={url}>{text}</Link>
    </MainMenuOptionBtn>
  );
};

export const RecordNewProjectBtn = () => {
  const url = '/record';
  return <MainOption url={url} text="Record New" />;
};

export const CreateConfigBtn = () => {
  const url = '/create';
  return <MainOption url={url} text="Create Project" />;
};

export const HomeBtn = () => (
  <HomeBtnHolder>
    <Link to="/">Home</Link>
  </HomeBtnHolder>
);

export const AddCameraDeviceBtn = (props) => (
  <ChooseDeviceBtn {...props}>Add Camera</ChooseDeviceBtn>
);

export const AddScreenBtn = (props) => (
  <ChooseDeviceBtn {...props}>Capture Screen</ChooseDeviceBtn>
);

export const AddMicBtn = () => <ChooseDeviceBtn>Add Mic</ChooseDeviceBtn>;

export const SelectDeviceOptionBtn = ({ label, ...otherProps }) => (
  <DeviceOptionBtn {...otherProps}>{label}</DeviceOptionBtn>
);
