import React, { useContext } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { WebThreeContext } from "../utils/ContextContract";

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

const Mint = ({ active, tokenId }) => {
  const { NFTContract } = useContext(WebThreeContext);

  const MintNFT = async () => {
    try {
      const tx = await NFTContract.createToken(tokenId);
      await tx.wait();
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
      {!active ? (
        <Button
          variant="contained"
          color="success"
          disabled
          endIcon={<AddIcon />}
          sx={{fontFamily:fontfamily}}
        >
          Mint
        </Button>
      ) : (
        <Button
          variant="contained"
          color="success"
          endIcon={<AddIcon />}
          onClick={MintNFT}
          sx={{fontFamily:fontfamily}}
        >
          Mint
        </Button>
      )}
    </>
  );
};

export default Mint;
