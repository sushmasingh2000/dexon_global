import { Dialog, Slide } from "@mui/material";
import React from "react";
import logo from '../assets/logo.png';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Loader = ({ isLoading }) => {
  return (
    <>
      <style>{`
        /* ── Loader animation ── */
        .loader {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FF3D00;
          position: relative;
        }
        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          border-radius: 50%;
          inset: 0;
          background: #fff;
          transform: rotate(0deg) translate(30px);
          animation: rotate 1s ease infinite;
        }
        .loader:after {
          animation-delay: 0.5s;
        }
        @keyframes rotate {
          100% { transform: rotate(360deg) translate(30px); }
        }
      `}</style>

      <Dialog
        open={isLoading}
        TransitionComponent={Transition}
        keepMounted
        disableScrollLock={true}   /* ← KEY FIX: prevents MUI from touching body scroll/padding at all */
        PaperProps={{
          style: {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(6, 13, 20, 0.75)",
            backdropFilter: "blur(4px)",
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            overflow: 'hidden',
          },
          '& .MuiModal-backdrop': {
            overflow: 'hidden',
          },
        }}
      >
        <div className="loader-backdrop">
          <div className="jalwa-logo-container">
            <div className="jalwa-border-spinner"></div>
            <img src={logo} alt="Jalwa Logo" className="jalwa-logo" />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Loader;