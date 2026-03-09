import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FaRegWindowClose } from "react-icons/fa";
import cardImg from "../images/europtrip.jpg";
// import cardImg from "../images/mentenence.png";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%", // 90% width on extra-small (mobile) screens
    sm: 400, // 400px width on small and up
  },
  height: {
    // 90% width on extra-small (mobile) screens
    sm: 450, // 400px width on small and up
  },
  bgcolor: "transparent",
  // boxShadow: 24,
};

export default function CustomPopup({
  onChangeFun = () => null,
  open = false,
  handleClose,
}) {
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, position: "relative" }}>
          <div className=" flex flex-row gap-3 pr-0 justify-end items-end bg-white">
            <FaRegWindowClose
              onClick={onChangeFun}
              className=" cursor-pointer text-red-600"
              size={25}
            />
            <FaRegWindowClose
              onClick={handleClose}
              className=" cursor-pointer text-green-600"
              size={25}
            />
          </div>

          <img src={cardImg} className="!h-full bg-cover !w-full" />
        </Box>
      </Modal>
    </div>
  );
}
