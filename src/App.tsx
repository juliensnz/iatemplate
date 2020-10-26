import React from 'react';
import {Content} from './components/Content';
import {PreferenceContext} from './context/PreferenceContext';
import {usePreferences} from './hooks/usePreferences';


function App() {
  const preferences = usePreferences();

  return (
    <PreferenceContext.Provider value={preferences}>
      <Content />
    </PreferenceContext.Provider>
  );
}

export default App;
