import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Box, LinearProgress } from '@mui/material';
import * as i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import SettingModal from './SettingModal';
import { LANGUAGES, Settings } from './constants';
import PasswordModal from './PasswordModal';

import enJson from './locales/en.json';
import jaJson from './locales/ja.json';

i18next.use(initReactI18next).init({
  debug: true,
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
  lng: 'ja',
  fallbackLng: false,
  returnEmptyString: false,
});

// constants of progress bar
const PROGRESS_STATE = {
  NONE: 0,
  INITIALIZE: 1,
  DETERMINATE: 2,
  COMPLETE: 3,
};

// constants of default settings
const DEF_SETTINGS = {
  SOURCE: '/Users/user/Downloads/source',
  DESTINATION: '/Users/user/Downloads/destination',
  LANGUAGE: LANGUAGES.LNG_JP,
  PASSWORD: '',
  LOCK: true,
};

const Index = () => {
  // copy progress
  const [progressState, setProgressState] = useState(PROGRESS_STATE.NONE);
  const [progress, setProgress] = useState(-1);
  // setting modal items
  const [settings, setSettings] = useState<Settings>({
    source: window.electron.store.get('source') || DEF_SETTINGS.SOURCE,
    destination:
      window.electron.store.get('destination') || DEF_SETTINGS.DESTINATION,
    language: window.electron.store.get('language') || DEF_SETTINGS.LANGUAGE,
    password: window.electron.store.get('password') || DEF_SETTINGS.PASSWORD,
    lock: DEF_SETTINGS.LOCK,
  });
  // localization
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  // IPC connection Listeners
  useEffect(() => {
    window.electron.ipcRenderer.on('cpdir', (percent: number) => {
      setProgress(percent);
    });
  }, []);

  // copy progress
  useEffect(() => {
    // do not show the progress bar before initialization
    if (progress === -1) {
      return;
    }

    if (progress === 0) {
      setProgressState(PROGRESS_STATE.INITIALIZE);
    } else if (progress > 0 && progress < 100) {
      setProgressState(PROGRESS_STATE.DETERMINATE);
    } else {
      setProgressState(PROGRESS_STATE.COMPLETE);
    }
  }, [progress]);

  // modal items
  const handleChangeSettings = (key: string, value: string | boolean) => {
    setSettings({ ...settings, ...{ [key]: value } });

    // Only lock of settings is not saved.
    if (key !== 'lock') {
      window.electron.store.set(key, value);
    }
  };

  // set the overal style with mui
  const appStyle = css({
    textAlign: 'center',
    fontFamily: 'Noto Sans JP',
  });

  // extend style of mui's button
  const MyButton = styled(Button)({
    backgroundColor: 'gray',
    '&:hover': {
      backgroundColor: 'gray',
    },
  });

  const progressBar = () => {
    switch (progressState) {
      case PROGRESS_STATE.DETERMINATE:
        return (
          <>
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box>{progress} %</Box>
          </>
        );

      case PROGRESS_STATE.INITIALIZE:
        return (
          <>
            <Box sx={{ width: '100%' }}>
              {progressState === PROGRESS_STATE.INITIALIZE ? (
                <LinearProgress variant="determinate" value={0} />
              ) : (
                <LinearProgress />
              )}
            </Box>
            <Box
              sx={{
                '@keyframes pulsate': {
                  from: {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  to: {
                    opacity: 0,
                    transform: 'scale(1.025)',
                  },
                },
                animation: 'pulsate 1.5s infinite ease',
              }}
            >
              {t('initializing...')}
            </Box>
          </>
        );

      case PROGRESS_STATE.COMPLETE:
        return <div>{t('completed!')}</div>;

      default:
        return <></>;
    }
  };

  return (
    <div css={appStyle}>
      <Box sx={{ textAlign: 'right' }}>
        <SettingModal settings={settings} setSettings={handleChangeSettings} />
      </Box>

      {/* If administrator password isn't set, show password setting modal. */}
      <PasswordModal settings={settings} setSettings={handleChangeSettings} />

      <MyButton
        type="button"
        variant="contained"
        disabled={
          progressState !== PROGRESS_STATE.NONE &&
          progressState !== PROGRESS_STATE.COMPLETE
        }
        onClick={() => {
          window.electron.ipcRenderer.cpdir(
            settings.source,
            settings.destination
          );
          setProgressState(PROGRESS_STATE.INITIALIZE);
          setProgress(0);
        }}
      >
        {t('copy directory')}
      </MyButton>

      {progressBar()}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}
