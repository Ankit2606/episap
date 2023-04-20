import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { WebThreeContext } from "../utils/ContextContract";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { NFTMarketPlaceAddress } from "../utils/ContractAddress";

const fontfamily = "'DynaPuff', cursive";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: "5px 5px 5px #1a1818",
  transition: "0.4s",
  p: 2,
  ":hover": {
    boxShadow: "10px 10px 15px #1a1818",
    transition: "0.4s",
  },
};

const MYNFT = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { NFTContract, NFTMarket, account } = useContext(WebThreeContext);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(0);

  const handleClose = () => setOpen(false);

  const resaleToken = async (itemid, tokenId) => {
    setOpen(false);
    try {
      const transaction = await NFTContract.approve(
        NFTMarketPlaceAddress,
        tokenId
      );
      await transaction.wait();
      toast.success("successfully Approved ", {
        toster,
      });
      const etherAmount = ethers.utils.parseEther(price);
      const weiAmount = etherAmount.toString();
      const tx = await NFTMarket.reSellToken(itemid, weiAmount);
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

  const loadNFTs = async () => {
    setIsLoading(true);
    const data = await NFTMarket.fetchMyNFTs();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await NFTContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          itemId: i.itemId.toNumber(),
          nftContract: `${i.nftContract.slice(0, 6)}...${i.nftContract.slice(
            -4
          )}`,
          tokenId: i.tokenId.toNumber(),
          price,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          acknowledge: meta.data.acknowledge,
        };

        setIsLoading(false);

        return item;
      })
    );
    setNfts(items);
  };

  useEffect(() => {
    loadNFTs();
  }, [account]);
  return (
    <>
      <Grid container>
        {isLoading ? (
          <Typography
            variant="h4"
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fontfamily,
            }}
          >
            You haven't bought any NFT yet
          </Typography>
        ) : (
          nfts.map((nft, i) => (
            <Grid item xs={12} md={3}>
              <Card
                className="mainCard"
                key={i}
                sx={{
                  boxShadow: "3px 3px 3px #9b9595",
                  ":hover": {
                    boxShadow: "5px 5px 7px #1a1818",
                  },
                }}
              >
                <CardMedia
                  className="mainCardHeader"
                  component="img"
                  alt="green iguana"
                  image={nft.image}
                />

                <CardContent className="miniCard2">
                  <Typography gutterBottom variant="body2" component="div">
                    <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                      ItemID
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.itemId}
                    </span>
                  </Typography>
                  <Typography gutterBottom variant="body2" component="div">
                    <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                      Price
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.price}
                    </span>
                  </Typography>
                  <Typography gutterBottom variant="body2" component="div">
                    <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                      NFTContract
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.nftContract}
                    </span>
                  </Typography>
                  <Typography gutterBottom variant="body2" component="div">
                    <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                      TokenID
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.tokenId}
                    </span>
                  </Typography>
                  <Typography gutterBottom variant="body2" component="div">
                    <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                      Name
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.name}
                    </span>
                  </Typography>

                  <Typography variant="body3" color="text.secondary">
                    <span style={{ fontWeight: 700, fontFamily: fontfamily }}>
                      Description
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.description}
                    </span>
                  </Typography>
                  <Typography
                    variant="body3"
                    color="text.secondary"
                    sx={{ marginTop: "7px" }}
                  >
                    <span style={{ fontWeight: 700, fontFamily: fontfamily }}>
                      Acknowledge
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      {nft.acknowledge}
                    </span>
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    marginTop: "-20px",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ fontFamily: fontfamily }}
                  >
                    Resale NFT
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        padding="5px"
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Typography variant="h4" padding={3} textAlign="center">
                          Create Poll
                        </Typography>
                        <TextField
                          type="number"
                          variant="outlined"
                          margin="normal"
                          size="small"
                          placeholder="Price"
                          name="name"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Button
                            sx={{
                              marginTop: 2,
                              marginRight: 2,
                              padding: "5px 7px",
                            }}
                            color="warning"
                            variant="contained"
                            onClick={handleClose}
                          >
                            Cancle
                            <CancelIcon sx={{ marginLeft: 1.5 }} />
                          </Button>
                          <Button
                            sx={{ marginTop: 2, padding: "5px" }}
                            color="success"
                            variant="contained"
                            type="submit"
                            onClick={() => resaleToken(nft.itemId, nft.tokenId)}
                          >
                            Create
                            <CheckCircleIcon sx={{ marginLeft: 1.5 }} />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Modal>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default MYNFT;
