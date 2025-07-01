import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SlideUp = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GroupModal({ open, onClose, groups }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isSmall}
      TransitionComponent={SlideUp}
      sx={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" }}
      PaperProps={{
        sx: {
          position: "absolute",
          bottom: 0,
          m: 0,
          width: "100%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "80vh",
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle>Available Groups</DialogTitle>
      <DialogContent>
        {groups.map((group, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{group.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{group.description}</Typography>
              <Typography variant="caption">
                Members: {group.members?.length || 0}
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                Join
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
    </Dialog>
  );
}
