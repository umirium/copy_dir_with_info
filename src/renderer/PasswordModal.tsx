import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { sha512 } from 'js-sha512';

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

const PasswordModal = ({ modal, closeModal, setSettings }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(validRules),
  });

  // Process of form submission after form validation has passed.
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setSettings('password', sha512(data.password));
    closeModal();
  };

  return (
    <>
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
            />
          </Box>

          <Typography id="modal-description" component="div" sx={{ mt: 2 }}>
            <Box sx={{ mt: 6, textAlign: 'right' }}>
              <Button variant="contained" onClick={handleSubmit(onSubmit)}>
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
