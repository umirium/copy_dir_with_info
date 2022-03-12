import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Slide,
  SlideProps,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { sha512 } from 'js-sha512';
import { useRef, useState } from 'react';

interface Props {
  modal: boolean;
  closeModal: () => void;
  setSettings: (key: string, value: string) => void;
}

// type of form
type FormInput = {
  password: string;
  confirm: string;
};

// form validation rules
const validRules = yup.object({
  password: yup
    .string()
    .required('* Please enter your password')
    .min(6, '* Your password is too short'),
  confirm: yup
    .string()
    .required('* Please retype your password')
    .oneOf([yup.ref('password')], '* Your passwords do not match.'),
});

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide {...props} direction="up" />;
}

const PasswordModal = ({ modal, closeModal, setSettings }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(validRules),
  });
  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);
  // refer to button
  const button = useRef<HTMLButtonElement>(null);

  // Process of form submission after form validation has passed.
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // show snackbar
    setTransition(() => TransitionUp);
    setSnackbarOpen(true);

    // encrypt password and store it in electron-store
    setSettings('password', sha512(data.password));
    closeModal();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // close button processing on snackbar
  const snapbarAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  // process when enter key is pressed on text fields
  const pressEnterKey = () => {
    if (!button.current) throw Error('submit is not assigned');
    button.current.click();
  };

  return (
    <>
      <div>
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          TransitionComponent={transition}
          message="Your password is set successfully!"
          key={transition ? transition.name : ''}
          autoHideDuration={3000}
          action={snapbarAction}
        />
      </div>

      <Modal
        open={modal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        disableEnforceFocus
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
            Please set your password.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <TextField
              type="password"
              label="Password"
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
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              type="password"
              label="Confirm"
              error={'confirm' in errors}
              helperText={errors.confirm?.message}
              fullWidth
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register('confirm')}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  pressEnterKey();
                }
              }}
            />
          </Box>

          <Typography id="modal-description" component="div" sx={{ mt: 2 }}>
            <Box sx={{ mt: 6, textAlign: 'right' }}>
              <Button
                variant="contained"
                ref={button}
                onClick={handleSubmit(onSubmit)}
              >
                send
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default PasswordModal;
