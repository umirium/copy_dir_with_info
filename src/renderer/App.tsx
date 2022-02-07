import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import AlbumIcon from '@mui/icons-material/Album';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Hello = () => {
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="App">
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

      <span>count: {count}</span>
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
