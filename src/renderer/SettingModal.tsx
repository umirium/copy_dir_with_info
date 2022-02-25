import { useState, useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
import LockIcon from '@mui/icons-material/Lock';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Select,
  Grid,
  Button,
  Backdrop,
  CircularProgress,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';

interface Props {
  modal: boolean;
  source: string;
  destination: string;
  language: string;
  closeModal: () => void;
  setLanguage: (language: string) => void;
  setSource: (source: string) => void;
  setDestination: (destination: string) => void;
}

// constants of modal items
const LANGUAGES = {
  LNG_EN: '1',
  LNG_JP: '2',
};

const SettingModal = ({
  modal,
  source,
  destination,
  language,
  closeModal,
  setLanguage,
  setSource,
  setDestination,
}: Props) => {
  // backdrop
  const [backdrop, setBackdrop] = useState(false);
  // each input fields
  const srcUploadRef = useRef<HTMLInputElement>(null);
  const dstUploadRef = useRef<HTMLInputElement>(null);
  const srcInputRef = useRef<HTMLInputElement>(null);
  const dstInputRef = useRef<HTMLInputElement>(null);

  // add attribute to file uploaders
  useEffect(() => {
    if (!srcUploadRef.current) return;
    srcUploadRef.current.setAttribute('directory', '');
    srcUploadRef.current.setAttribute('webkitdirectory', '');

    if (!dstUploadRef.current) return;
    dstUploadRef.current.setAttribute('directory', '');
    dstUploadRef.current.setAttribute('webkitdirectory', '');
  });

  // modal control
  const handleCloseModal = () => {
    closeModal();
  };

  // backdrop while selecting folder paths
  const handleOpenBackdrop = () => setBackdrop(true);
  const handleCloseBackdrop = () => setBackdrop(false);

  // modal items
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleClickSrc = () => {
    if (!srcUploadRef.current) throw Error('srcUploadRef is not assigned');
    srcUploadRef.current.click();
    handleOpenBackdrop();
  };
  const handleChangeSrcInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const path = event.target.files[0].path.split('/');
      path.pop();
      setSource(path.join('/'));
      handleCloseBackdrop();
    }
  };

  const handleClickDst = () => {
    if (!dstUploadRef.current) throw Error('dstUploadRef is not assigned');
    dstUploadRef.current.click();
    handleOpenBackdrop();
  };
  const handleChangeDstInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const path = event.target.files[0].path.split('/');
      path.pop();
      setDestination(path.join('/'));
      handleCloseBackdrop();
    }
  };

  return (
    <>
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

      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1301 }}
          open={backdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Modal
        open={modal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
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
          <Typography id="modal-title" variant="h6" component="h2">
            Settings
          </Typography>
          <Typography id="modal-description" component="div" sx={{ mt: 2 }}>
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
                <MenuItem value={LANGUAGES.LNG_EN}>English</MenuItem>
                <MenuItem value={LANGUAGES.LNG_JP}>Japanese</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 6, flexGrow: 1, textAlign: 'right' }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                  <IconButton aria-label="lock">
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
    </>
  );
};

export default SettingModal;
