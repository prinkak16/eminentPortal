import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {toast} from 'react-toastify';
import {
  allotmentUnassign,
  getAssignedAllotment,
} from "../../../../../../api/eminentapis/endpoints";
import AllotmentContext from "../../context/allotmentContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  height: "450px",
  borderRadius: "5px",
};

function unassignModal({ System, setSystem, historyId }) {
  const handleClose = () => setSystem(false);

  const handleModalSystem = (historyId) => {
    allotmentUnassign(historyId)
      .then((res) => {
        setSystem(false);
        toast(res.data.message);
      }, (error) => {
        setSystem(false);
        toast(error.response.data.message);
      });
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={System}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={System}>
          <Box sx={style}>
            {/* Add your modal content here */}
            <div>
              <div className="modal-head-123">
                <button
                  className="cross-btn-1"
                  onClick={() => setSystem(false)}
                >
                  x
                </button>
              </div>
              <div className="modal-body-123-1">
                <div className="modal-1">
                  <h4>
                    Are you sure you want to unassign "Narendra Huda" for this
                    position?
                  </h4>
                </div>
                <div>
                  <div className="modal-2">
                    <p style={{ fontWeight: "400" }}>
                      PSU Name -{" "}
                      <span style={{ fontWeight: "600" }}>
                        Law Enforcement Training Institute
                      </span>
                    </p>
                  </div>

                  <div className="unassign-location-div">
                    <span>Location - New Delhi</span>
                  </div>
                </div>

                <div className="modal-3">
                  <textarea
                    placeholder="Write something…"
                    className="modal-textarea"
                  />
                </div>

                <div className="unassign-btn-div">
                  <div className="modal-4">
                    <button
                      className="modal-btn-sure"
                      onClick={() => handleModalSystem(historyId)}
                    >
                      Sure
                    </button>
                  </div>
                  <div className="modal-5">
                    <button className="modal-btn-cancel">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default unassignModal;
