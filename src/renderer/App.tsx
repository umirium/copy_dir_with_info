import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import '@fontsource/noto-sans-jp/';
import '@fontsource/noto-sans-jp/100.css';
import '@fontsource/noto-sans-jp/300.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';

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

const Index = () => {
  const [count, setCount] = useState<number>(0);
  // copy progress
  const [progressState, setProgressState] = useState(PROGRESS_STATE.NONE);
  const [progress, setProgress] = useState(-1);
  // modal items
  const [modal, setModal] = useState(false);
  const [source, setSource] = useState('/Users/user/Downloads/source');
  const [destination, setDestination] = useState(
    '/Users/user/Downloads/destination'
  );
  const [language, setLanguage] = useState<string>(LANGUAGES.LNG_EN);
  const srcUploadRef = useRef<HTMLInputElement>(null);
  const dstUploadRef = useRef<HTMLInputElement>(null);
  const srcInputRef = useRef<HTMLInputElement>(null);
  const dstInputRef = useRef<HTMLInputElement>(null);

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

  // add attribute to file uploaders
  useEffect(() => {
    if (!srcUploadRef.current) throw Error('srcUploadRef is not assigned');
    srcUploadRef.current.setAttribute('directory', '');
    srcUploadRef.current.setAttribute('webkitdirectory', '');

    if (!dstUploadRef.current) throw Error('dstUploadRef is not assigned');
    dstUploadRef.current.setAttribute('directory', '');
    dstUploadRef.current.setAttribute('webkitdirectory', '');
  });

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  // Modal control
  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);

  // Modal items
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleClickSrc = () => {
    if (!srcUploadRef.current) throw Error('srcUploadRef is not assigned');
    srcUploadRef.current.click();
  };
  const handleChangeSrcInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const path = event.target.files[0].path.split('/');
      path.pop();
      setSource(path.join('/'));
    }
  };

  const handleClickDst = () => {
    if (!dstUploadRef.current) throw Error('dstUploadRef is not assigned');
    dstUploadRef.current.click();
  };
  const handleChangeDstInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const path = event.target.files[0].path.split('/');
      path.pop();
      setDestination(path.join('/'));
    }
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
      {/* file uploader for source folder icon and destination folder icon */}
      <input
        hidden
        ref={srcUploadRef}
        type="file"
        onChange={handleChangeSrcInput}
      />
      <input
        hidden
        ref={dstUploadRef}
        type="file"
        onChange={handleChangeDstInput}
      />

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

      <Modal
        open={modal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '0px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Settings
          </Typography>
          <Typography
            id="modal-modal-description"
            component="div"
            sx={{ mt: 2 }}
          >
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="source">Source</InputLabel>
              <OutlinedInput
                id="source"
                type="text"
                ref={srcInputRef}
                value={source}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="select source directory"
                      onClick={handleClickSrc}
                      edge="end"
                    >
                      <FolderIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Source"
                disabled
              />
            </FormControl>

            <FormControl variant="outlined" sx={{ mt: 2 }} fullWidth>
              <InputLabel htmlFor="destination">Destination</InputLabel>
              <OutlinedInput
                id="destination"
                type="text"
                ref={dstInputRef}
                value={destination}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="select destination directory"
                      onClick={handleClickDst}
                      edge="end"
                    >
                      <FolderIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Destination"
                disabled
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 4 }}>
              <InputLabel id="select-language">Language</InputLabel>
              <Select
                labelId="select-language"
                id="language"
                value={language}
                label="Language"
                onChange={handleChangeLanguage}
              >
                <MenuItem value="1">English</MenuItem>
                <MenuItem value="2">Japanese</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 6, flexGrow: 1, textAlign: 'right' }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                  <IconButton aria-label="lock" onClick={handleOpenModal}>
                    <LockIcon sx={{ fontSize: 30, cursor: 'pointer' }} />
                  </IconButton>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    startIcon={<CloseIcon />}
                    onClick={handleCloseModal}
                  >
                    close
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Typography>
        </Box>
      </Modal>

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
