import { ChangeEvent, useRef, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
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
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, ModalProps, ModalStyle } from './constants';
import UnlockModal from './UnlockModal';

const SettingModal = ({ settings, setSettings }: ModalProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    // lock settings at end of modal
    setSettings('lock', true);

    setOpen(false);
  };
  // localization
  const [t] = useTranslation();

  // each input fields
  const srcUploadRef = useRef<HTMLInputElement>(null);
  const dstUploadRef = useRef<HTMLInputElement>(null);
  const srcInputRef = useRef<HTMLInputElement>(null);
  const dstInputRef = useRef<HTMLInputElement>(null);

  // modal items
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setSettings('language', event.target.value);
  };

  const handleClickSrc = () => {
    if (!srcUploadRef.current) throw Error('srcUploadRef is not assigned');
    srcUploadRef.current.click();
  };
  const handleChangeSrcInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const path = event.target.files[0].path.split('/');
      path.pop();
      setSettings('source', path.join('/'));
    }
  };

  const handleClickDst = () => {
    if (!dstUploadRef.current) throw Error('dstUploadRef is not assigned');
    dstUploadRef.current.click();
  };
  const handleChangeDstInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const path = event.target.files[0].path.split('/');
      path.pop();
      setSettings('destination', path.join('/'));
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

      <IconButton aria-label="settings" onClick={handleOpen}>
        <SettingsIcon sx={{ fontSize: 30, cursor: 'pointer' }} />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...ModalStyle, width: 500 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {t('Settings')}
          </Typography>
          <Typography id="modal-description" component="div" sx={{ mt: 2 }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="source">{t('Source')}</InputLabel>
              <OutlinedInput
                id="source"
                type="text"
                ref={srcInputRef}
                value={settings.source}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="select source directory"
                      onClick={handleClickSrc}
                      edge="end"
                      disabled={settings.lock}
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
              <InputLabel htmlFor="destination">{t('Destination')}</InputLabel>
              <OutlinedInput
                id="destination"
                type="text"
                ref={dstInputRef}
                value={settings.destination}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="select destination directory"
                      onClick={handleClickDst}
                      edge="end"
                      disabled={settings.lock}
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
              <InputLabel id="select-language">{t('Language')}</InputLabel>
              <Select
                labelId="select-language"
                id="language"
                value={settings.language}
                label="Language"
                onChange={handleChangeLanguage}
              >
                <MenuItem value={LANGUAGES.LNG_EN}>{t('English')}</MenuItem>
                <MenuItem value={LANGUAGES.LNG_JP}>{t('Japanese')}</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 6, flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                  <UnlockModal settings={settings} setSettings={setSettings} />
                </Grid>

                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    startIcon={<CloseIcon />}
                    onClick={handleClose}
                  >
                    {t('close')}
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
