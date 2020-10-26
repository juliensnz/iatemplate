import {useState, useMemo, useEffect} from 'react';
import {Preferences} from '../context/PreferenceContext';
const { ipcRenderer } = window.require('electron');

const usePreferences = (): Preferences => {
  const [preferences, setPreferences] = useState({});
  const updatePreferences = useMemo(() => async () => {
    const prefs = await ipcRenderer.invoke('getStoreValue', 'preferences');

    setPreferences(prefs)
  }, []);

  useEffect(() => {
    ipcRenderer.on('preferences:updated', updatePreferences)

    updatePreferences()

    return () => {
      ipcRenderer.removeListener('preferences:updated', updatePreferences);
    }
  }, [updatePreferences]);

  return preferences;
}

export {usePreferences}
