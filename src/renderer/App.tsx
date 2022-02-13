import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const Hello = () => {
  const [count, setCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // IPC connection Listeners
    window.electron.ipcRenderer.on('mkdir', (result: boolean) => {
      console.log(`make directory: ${result}`);
    });
    window.electron.ipcRenderer.on('cpdir', (percent: number) => {
      console.log(percent);
      setProgress(percent);
    });
  }, []);

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
        }}
      >
        copy directory
      </MyButton>

      <div>progress: {progress}</div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
