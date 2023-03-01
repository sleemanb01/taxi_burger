import { Modal } from "@mui/material";

import "../../../../styles/css/global.css";

export default function ImagePreview({
  open,
  closeHandler,
  img,
}: {
  open: boolean;
  closeHandler: () => void;
  img: string;
}) {
  return (
    <Modal
      open={open}
      onClose={closeHandler}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <img className="preview-image" src={img} alt={`previewing ${img}`} />
    </Modal>
  );
}
