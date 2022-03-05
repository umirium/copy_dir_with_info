import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Box, IconButton, LinearProgress } from '@mui/material';
import '@fontsource/noto-sans-jp/';
import '@fontsource/noto-sans-jp/100.css';
import '@fontsource/noto-sans-jp/300.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';
import SettingModal from './SettingModal';

// constants of progress bar
const PROGRESS_STATE = {
  NONE: 0,
  INITIALIZE: 1,
  DETERMINATE: 2,
  INDETERMINATE: 3,
  COMPLETE: 4,
};

// constants of modal items
const LANGUAGES = {
  LNG_EN: '1',
  LNG_JP: '2',
};

// constants of default settings
const DEF_SETTINGS = {
  SOURCE: '/Users/user/Downloads/source',
  DESTINATION: '/Users/user/Downloads/destination',
  LANGUAGE: LANGUAGES.LNG_JP,
};

// constants of electron-store key
const STORE = {
  SOURCE: 'source',
  DESTINATION: 'destination',
  LANGUAGE: 'language',
};

const Index = () => {
  const [count, setCount] = useState<number>(0);
  // copy progress
  const [progressState, setProgressState] = useState(PROGRESS_STATE.NONE);
  const [progress, setProgress] = useState(-1);
  // modal items
  const [modal, setModal] = useState(false);
  const [source, setSource] = useState(DEF_SETTINGS.SOURCE);
  const [destination, setDestination] = useState(DEF_SETTINGS.DESTINATION);
  const [language, setLanguage] = useState<string>(DEF_SETTINGS.LANGUAGE);

  // initialize settings with data got from electron-store
  useEffect(() => {
    let value = window.electron.store.get(STORE.SOURCE);

    if (value) {
      setSource(value);
    }

    value = window.electron.store.get(STORE.DESTINATION);

    if (value) {
      setDestination(value);
    }

    value = window.electron.store.get(STORE.LANGUAGE);

    if (value) {
      setLanguage(value);
    }
  }, []);

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
  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);

  // modal items
  const handleChangeLanguage = (selectedLanguage: string) => {
    window.electron.store.set(STORE.LANGUAGE, selectedLanguage);
    setLanguage(selectedLanguage);
  };
  const handleChangeSource = (path: string) => {
    window.electron.store.set(STORE.SOURCE, path);
    setSource(path);
  };
  const handleChangeDestination = (path: string) => {
    window.electron.store.set(STORE.DESTINATION, path);
    setDestination(path);
  };

  // set the overal style with mui
  const appStyle = css({
    textAlign: 'center',
    fontFamily: 'Noto Sans JP',
    div: {
      paddingTop: '1em',
    },
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
        <IconButton aria-label="settings" onClick={handleOpenModal}>
          <SettingsIcon sx={{ fontSize: 30, cursor: 'pointer' }} />
        </IconButton>
      </Box>

      <SettingModal
        modal={modal}
        source={source}
        destination={destination}
        language={language}
        closeModal={handleCloseModal}
        setLanguage={handleChangeLanguage}
        setSource={handleChangeSource}
        setDestination={handleChangeDestination}
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
          window.electron.ipcRenderer.cpdir(source, destination);
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
