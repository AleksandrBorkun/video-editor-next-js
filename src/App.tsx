import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// import icon from '../assets/icon.svg';
import styled from 'styled-components';
import {
  CreateConfigBtn,
  HomeBtn,
  // RecordNewProjectBtn,
} from './components/buttons';
import NewProject from './pages/Configuration';
// import Recorder from './pages/Recodrer';
import RecordWithConfog, { IConfig } from './pages/RecordWithConfig';

const MainMenuHolder = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const H1 = styled.h1`
  color: black;
`;

const Hello = () => {
  return (
    <MainMenuHolder>
      {/* <RecordNewProjectBtn /> */}
      <CreateConfigBtn />
    </MainMenuHolder>
  );
};

export default function App() {

  const [config, setConfig] = useState([] as IConfig[])
  return (
    <Router>
      <HomeBtn />
      <Switch>
        <Route exact path="/" component={Hello} />
        <Route exact path="/create" component={() => <NewProject passConfig={setConfig}/>} />
        {/* <Route exact path="/record" component={RecordWithConfog} /> */}
        <Route exact path="/record" component={()=><RecordWithConfog config={config}/>} />
      </Switch>
    </Router>
  );
}
