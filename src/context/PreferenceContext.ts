import {createContext} from 'react';

type Preferences = {
  logoDirectory?: string
}

const PreferenceContext = createContext<Preferences>({});

export {PreferenceContext};
export type {Preferences}
