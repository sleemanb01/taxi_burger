import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { modal_style } from "../../../../styles/modal-style";
import Divider from "@mui/material/Divider";

type ModalProps = {
  show: boolean;
  header?: string;
  content: string;
  onCancel: Function;
  onSubmit?: Function;
  footer?: JSX.Element;
};

export function BasicModal({
  show,
  header,
  content,
  onCancel,
  onSubmit,
  footer,
}: ModalProps) {
  const [open, setOpen] = React.useState(show);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {header}
          </Typography>
          <Divider />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {content}
          </Typography>
          <Divider />
          {footer}
        </Box>
      </Modal>
    </div>
  );
}
