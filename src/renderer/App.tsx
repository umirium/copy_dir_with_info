import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Box, LinearProgress } from '@mui/material';

// constants of progress bar
const PROGRESS_STATE = {
  NONE: 0,
  DETERMINATE: 1,
  INDETERMINATE: 2,
};

const Index = () => {
  const [count, setCount] = useState<number>(0);
  const [progressState, setProgressState] = useState(PROGRESS_STATE.NONE);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // IPC connection Listeners
    window.electron.ipcRenderer.on('mkdir', (result: boolean) => {
      console.log(`make directory: ${result}`);
    });
    window.electron.ipcRenderer.on('cpdir', (percent: number) => {
      console.log(percent);
      setProgress(percent * 2);
    });
  }, []);

  useEffect(() => {
    if (progress > 100) {
      setProgressState(PROGRESS_STATE.INDETERMINATE);
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

  // set the overal style with mui
  const appStyle = css({
    textAlign: 'center',
    fontFamily: 'NotoJP',
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
            {progress} %
          </>
        );
      case PROGRESS_STATE.INDETERMINATE:
        return (
          <>
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
            processing...
          </>
        );
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
        onClick={() => {
          window.electron.ipcRenderer.cpdir(
            '/Users/user/Downloads/source',
            '/Users/user/Downloads/destination'
          );
          setProgressState(PROGRESS_STATE.DETERMINATE);
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
