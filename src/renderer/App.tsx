import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Box, LinearProgress } from '@mui/material';
import '@fontsource/noto-sans-jp/';
import '@fontsource/noto-sans-jp/100.css';
import '@fontsource/noto-sans-jp/300.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';
import SettingModal from './SettingModal';
import { LANGUAGES, Settings } from './constants';
import PasswordModal from './PasswordModal';

// constants of progress bar
const PROGRESS_STATE = {
  NONE: 0,
  INITIALIZE: 1,
  DETERMINATE: 2,
  INDETERMINATE: 3,
  COMPLETE: 4,
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
  const [count, setCount] = useState<number>(0);
  // copy progress
  const [progressState, setProgressState] = useState(PROGRESS_STATE.NONE);
  const [progress, setProgress] = useState(-1);
  // modal of setting administrator password
  const [setupPassModal, setSetupPassModal] = useState(false);
  // setting modal items
  const [settings, setSettings] = useState<Settings>({
    source: window.electron.store.get('source') || DEF_SETTINGS.SOURCE,
    destination:
      window.electron.store.get('destination') || DEF_SETTINGS.DESTINATION,
    language: window.electron.store.get('language') || DEF_SETTINGS.LANGUAGE,
    password: window.electron.store.get('password') || DEF_SETTINGS.PASSWORD,
    lock: DEF_SETTINGS.LOCK,
  });

  // IPC connection Listeners
  useEffect(() => {
    window.electron.ipcRenderer.on('mkdir', (result: boolean) => {
      console.log(`make directory: ${result}`);
    });
    window.electron.ipcRenderer.on('cpdir', (percent: number) => {
      console.log(percent);
      setProgress(percent * 2);
    });
  }, []);

  // If administrator password isn't set, show password setting modal.
  useEffect(() => {
    if (!settings.password) {
      setSetupPassModal(true);
    }
  }, [settings.password]);

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
    } else if (progress < 200) {
      setProgressState(PROGRESS_STATE.INDETERMINATE);
    } else {
      setProgressState(PROGRESS_STATE.COMPLETE);
    }
  }, [progress]);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  // modal control
  const handleCloseSetupPassModal = () => setSetupPassModal(false);

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

  // The remaining processes that exceed 100% will be shown as "Linear indeterminate"
  // because the number of files after filtering is unknown.
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
      case PROGRESS_STATE.INDETERMINATE:
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
              {progressState === PROGRESS_STATE.INITIALIZE
                ? 'initializing...'
                : 'processing...'}
            </Box>
          </>
        );

      case PROGRESS_STATE.COMPLETE:
        return <div>completed!</div>;

      default:
        return <></>;
    }
  };

  return (
    <div css={appStyle}>
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained" onClick={increment}>
          increment
        </Button>
        <Button variant="outlined" onClick={decrement}>
          decrement
        </Button>
        <Button variant="contained" endIcon={<AlbumIcon />} onClick={reset}>
          reset
        </Button>
      </Stack>

      <Box sx={{ textAlign: 'right' }}>
        <SettingModal settings={settings} setSettings={handleChangeSettings} />
      </Box>

      <PasswordModal
        modal={setupPassModal}
        setSettings={handleChangeSettings}
        closeModal={handleCloseSetupPassModal}
      />

      <div>count: {count}</div>

      <div>This is Test.</div>

      <div>日本語テストです。</div>

      <div
        css={{
          fontWeight: 'bold',
        }}
      >
        太字のテストです。
      </div>

      <div
        css={{
          fontWeight: '100',
        }}
      >
        細字のテストです。
      </div>

      <Button
        type="button"
        variant="contained"
        color="secondary"
        onClick={() => {
          window.electron.ipcRenderer.mkdir('/Users/user/Downloads/mkdir', [
            'aaa.txt',
            'bbb.dat',
            'ccc.html',
          ]);
        }}
      >
        create directory
      </Button>

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
        copy directory
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
