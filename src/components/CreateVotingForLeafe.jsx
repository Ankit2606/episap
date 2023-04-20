import React, { useContext, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { WebThreeContext } from "../utils/ContextContract";
import { toast } from "react-toastify";

const fontfamily= "'DynaPuff', cursive";

const toster = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const CreateVotingForLeafe = ({
  buttonname,
  variant,
  color,
  vote,
  tokenId,
  votingper,
}) => {
  const [progress, setProgress] = React.useState(0);

  const set_progress = () => {
    setProgress(votingper);
  };

  useEffect(() => {
    set_progress();
  }, [progress]);
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel
        value={progress}
        buttonname={buttonname}
        variants={variant}
        colors={color}
        vote={vote}
        tokenid={tokenId}
      />
    </Box>
  );
};

function LinearProgressWithLabel(props) {
  const { NFTContract } = useContext(WebThreeContext);

  const VotingButton = async () => {
    try {
      const data = await NFTContract.createVoting(props.vote, props.tokenid);
      await data();
      toast.success("Transaction is successfully completed", {
        toster,
      });
    } catch (error) {
      toast.error(error.error.data.message, {
        toster,
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0px",
          my: 1,
        }}
      >
        <Box sx={{ width: "58%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            minWidth: 25,
            mr: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
          <Button
            variant={props.variants}
            color={props.colors}
            sx={{ ml: 1,fontFamily:fontfamily}}
            onClick={VotingButton}
          >
            {props.buttonname}
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateVotingForLeafe;
