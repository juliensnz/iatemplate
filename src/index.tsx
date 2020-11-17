import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import {App} from './App';
import {createGlobalStyle} from 'styled-components';
import {ProgressProvider} from './context/ProgressContext';

const GlobalStyle = createGlobalStyle`
  body {
    min-height: 100vh;
  }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
