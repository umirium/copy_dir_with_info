import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useRef, useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { sha512 } from 'js-sha512';
import { ModalProps, ModalStyle } from './constants';
import { useTranslation } from 'react-i18next';

// type of form
type FormInput = {
  password: string;
};

// form validation rules
const validRules = yup.object({});

const UnlockModal = ({ settings, setSettings }: ModalProps) => {
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(validRules),
  });
  // refer to button
  const button = useRef<HTMLButtonElement>(null);
  // modal status
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    // If settings are locked, open the unlock modal.
    if (settings.lock) {
      setOpen(true);
      return;
    }

    // If settings aren't locked, locking settings.
    setSettings('lock', true);
  };
  const handleClose = () => {
    reset({ password: '' });
    setOpen(false);
  };
  // localization
  const [t] = useTranslation();

  // process when enter key is pressed on text fields
  const pressEnterKey = () => {
    if (!button.current) throw Error('submit is not assigned');
    button.current.click();

    // select entire password entered
    button.current.focus();
    setFocus('password');
  };

  // Process of form submission after form validation has passed.
  const onSubmit: SubmitHandler<FormInput> = () => {
    // password entered is correct.
    if (sha512(getValues('password')) === settings.password) {
      setSettings('lock', false);
      handleClose();

      return;
    }

    // password entered isn't correct.
    setFocus('password');

    setError('password', {
      type: 'manual',
      message: t('Password is incorrect'),
    });
  };

  return (
    <>
      <IconButton aria-label="lock" onClick={handleOpen}>
        {settings.lock ? (
          <LockIcon sx={{ fontSize: 30, cursor: 'pointer' }} />
        ) : (
          <LockOpenIcon sx={{ fontSize: 30, cursor: 'pointer' }} />
        )}
      </IconButton>

      <Modal hideBackdrop open={open}>
        <Box sx={{ ...ModalStyle, width: 350, border: '1px solid #000' }}>
          <h3>{t('Enter administrator password')}</h3>

          <Box sx={{ mt: 2 }}>
            <TextField
              type="password"
              label={t('Password')}
              error={'password' in errors}
              helperText={errors.password?.message}
              autoFocus
              fullWidth
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('password')}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  pressEnterKey();
                }
              }}
              onFocus={(event) => {
                event.target.select();
              }}
            />
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleClose}
            >
              {t('Cancel')}
            </Button>

            <Button
              variant="contained"
              ref={button}
              startIcon={<LockOpenIcon />}
              sx={{ ml: 2 }}
              onClick={handleSubmit(onSubmit)}
            >
              {t('Unlock')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UnlockModal;
