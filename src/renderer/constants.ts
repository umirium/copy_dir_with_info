export type Settings = {
  source: string;
  destination: string;
  language: string;
  password: string;
  lock: boolean;
};

export const LANGUAGES = {
  LNG_EN: '1',
  LNG_JP: '2',
};

// default modal style
export const ModalStyle = {
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
};
