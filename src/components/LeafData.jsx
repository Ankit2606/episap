import React, { useState, useContext, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { WebThreeContext } from "../utils/ContextContract";
import { ethers } from "ethers";
import { Box, Grid, Input, Modal, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { create as ipfsClient } from "ipfs-http-client";
import { toast } from "react-toastify";
import CreateVotingForLeafe from "./CreateVotingForLeafe";
import Mint from "./Mint";
import InfoIcon from "@mui/icons-material/Info";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import NFTAbi from "../utils/ABI/NFT.json";
import { NFTContractAddress } from "../utils/ContractAddress";

const projectId = "2EydPKGqmXcXAKly2TBkdObNCHk"; // <---------- your Infura Project ID

const projectSecret = "658bddb4241f2bdcd3a9073955dd9fd6"; // <---------- your Infura Secret

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const fontfamily = "'DynaPuff', cursive";

const ipfs = ipfsClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

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

const LeafData = ({
  i,
  image,
  description,
  tokenId,
  parentId,
  name,
  acknowledge,
}) => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [price, setPrice] = useState(0);
  const [yesvote, setyesvote] = useState(0);
  const [novote, setnovote] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    acknowledge: "",
    image: null,
  });
  const { NFTContract, account } = useContext(WebThreeContext);
  const [value, setvalue] = useState({
    yesvalue: 0,
    novalue: 0,
    totalvoter: 0,
    active: false,
  });



  const getPollData = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://matic-mumbai.chainstacklabs.com"
    );
    const contract = new ethers.Contract(
      NFTContractAddress,
      NFTAbi.abi,
      provider
    );
    const data = await contract.getData(tokenId);
    setvalue({
      yesvalue: data.yes.toNumber(),
      novalue: data.no.toNumber(),
      totalvoter: data.Totalvoter.toNumber(),
      active: data.active,
    });
  };

  function ProgressValue() {
    if (value.totalvoter > 0) {
      const yesvoteper = (value.yesvalue * 100) / value.totalvoter;
      setyesvote(yesvoteper);
      const novoteper = (value.novalue * 100) / value.totalvoter;
      setnovote(novoteper);
    }
  }

  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);
  const handleClose2 = () => setOpen2(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormValues({ ...formValues, [name]: e.target.files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    setOpen(false);
    e.preventDefault();
    try {
      // Upload image to IPFS
      const image = await ipfs.add(formValues.image);

      // Create metadata object
      const metadata = {
        name: formValues.name,
        description: formValues.description,
        acknowledge: formValues.acknowledge,
        image: `https://infura-ipfs.io/ipfs/${image.cid.toString()}`,
      };
      // Upload metadata to IPFS
      const metadataCID = await ipfs.add(JSON.stringify(metadata));
      const metadataCID1 = `https://infura-ipfs.io/ipfs/${metadataCID.path.toString()}`

      const tx = await NFTContract.createLeafToken(tokenId, metadataCID1);
      await tx.wait();
      toast.success("Transaction is successfully completed", {
        toster,
      });
    } catch (error) {
      toast.error("Transaction cancled", {
        toster,
      });
    }
  };

  const handleCreatePoll = async () => {
    setOpen1(false);
    try {
      const etherAmount = ethers.utils.parseEther(price);
      const weiAmount = etherAmount.toString();
      const transaction = await NFTContract.createPoll(tokenId, weiAmount);
      await transaction.wait();
      toast.success("Transaction is successfully completed", {
        toster,
      });
    } catch (error) {
      toast.error(error.error.data.message, {
        toster,
      });
    }
  };

  useEffect(() => {
    getPollData();
  }, [account]);

  return (
    <>
      <Grid item xs={12} md={3}>
        <Card
          className="mainCard  "
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
            image={image}
          />

          <CardContent className="miniCard">
            <Typography gutterBottom variant="body1" component="div">
              <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                LeafID
              </span>
              :
              <span
                style={{
                  fontFamily: "fantasy",
                  fontSize: "17px",
                  padding: "0px",
                }}
              >
                {tokenId}
              </span>
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              <span style={{ fontWeight: 900, fontFamily: fontfamily }}>
                ParentId
              </span>
              :
              <span
                style={{
                  fontFamily: "fantasy",
                  fontSize: "17px",
                  padding: "0px",
                }}
              >
                {parentId}
              </span>
            </Typography>

            <Typography gutterBottom variant="body1" component="div">
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
                {name}
              </span>
            </Typography>

            <Typography variant="body2" color="text.secondary">
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
                {description}
              </span>
            </Typography>
            <Typography
              variant="body2"
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
                {acknowledge}
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
              CreateLeaf
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setOpen1(true)}
              sx={{ fontFamily: fontfamily }}
            >
              CreatePoll
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                setShowDetails(!showDetails);
                ProgressValue();
              }}
              sx={{ fontFamily: fontfamily }}
            >
              {showDetails ? "Details" : "Details"}
            </Button>
          </CardActions>
          {showDetails && (
            <CardContent>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#c31212",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fontfamily,
                }}
              >
                Vote Yes/No For Approval to Mint NFT
                <span
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  onClick={() => setOpen2(true)}
                >
                  <InfoIcon />
                </span>
              </Typography>
              <CreateVotingForLeafe
                buttonname="YES"
                variant="contained"
                color="info"
                vote={1}
                tokenId={tokenId}
                votingper={yesvote}
              />
              <CreateVotingForLeafe
                buttonname="NO"
                variant="contained"
                color="error"
                vote={0}
                tokenId={tokenId}
                votingper={novote}
              />
              <Mint active={value.active} tokenId={tokenId} />
            </CardContent>
          )}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <form onSubmit={(e) => handleSubmit(e)}>
              <Box sx={style}>
                <Box
                  display="flex"
                  flexDirection="column"
                  padding="5px"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant="h4" padding={3} textAlign="center">
                    Create Leaf
                  </Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    margin="normal"
                    size="small"
                    placeholder="Name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    variant="outlined"
                    margin="normal"
                    size="small"
                    placeholder="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    variant="outlined"
                    margin="normal"
                    size="small"
                    placeholder="Acnowledgement"
                    name="acknowledge"
                    value={formValues.acknowledge}
                    onChange={handleChange}
                  />
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    size="small"
                    sx={{
                      maxWidth: "230px",
                      marginTop: "10px",
                      marginBottom: "5px",
                    }}
                    onChange={handleChange}
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
                    >
                      Confirm
                      <CheckCircleIcon sx={{ marginLeft: 1.5 }} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Modal>

          <Modal
            open={open1}
            onClose={handleClose1}
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
                    onClick={handleClose1}
                  >
                    Cancle
                    <CancelIcon sx={{ marginLeft: 1.5 }} />
                  </Button>
                  <Button
                    sx={{ marginTop: 2, padding: "5px" }}
                    color="success"
                    variant="contained"
                    type="submit"
                    onClick={handleCreatePoll}
                  >
                    Create
                    <CheckCircleIcon sx={{ marginLeft: 1.5 }} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={open2}
            onClose={handleClose2}
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
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#33539b",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    fontFamily: fontfamily,
                  }}
                >
                  <ArrowRightIcon /> If 51% Positive votes are made then this
                  NFT is allowed to be minted
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#33539b",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    fontFamily: fontfamily,
                  }}
                >
                  <ArrowRightIcon /> If First 3 Members positively voted then
                  this NFT is allowed to be minted
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#33539b",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    fontFamily: fontfamily,
                  }}
                >
                  <ArrowRightIcon /> If there are only 2 Members and first
                  members gives Positive vote then this NFT is allowed to be
                  minted
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    color: "#33539b",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    fontFamily: fontfamily,
                  }}
                >
                  <ArrowRightIcon /> If 51% Negative votes are made then this
                  NFT is not-allowed to be minted
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleClose2}
                  color="error"
                  sx={{ marginTop: "10px", fontFamily: fontfamily }}
                >
                  Cancle
                </Button>
              </Box>
            </Box>
          </Modal>
        </Card>
      </Grid>
    </>
  );
};

export default LeafData;
