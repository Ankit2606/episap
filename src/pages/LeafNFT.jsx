import React, { useState, useContext, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { WebThreeContext } from "../utils/ContextContract";
import axios from "axios";
import { ethers } from "ethers";
import LoadingSpinner from "../utils/Spinner";
import { Box, Grid, Input, Modal, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { create as ipfsClient } from "ipfs-http-client";
import { toast } from "react-toastify";

const projectId = "2EydPKGqmXcXAKly2TBkdObNCHk"; // <---------- your Infura Project ID

const projectSecret = "658bddb4241f2bdcd3a9073955dd9fd6"; // <---------- your Infura Secret

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

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

const LeafNFT = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ids, setids] = useState();
  const [open1, setOpen1] = useState(false);
  const [price, setPrice] = useState(0);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    acknowledge: "",
    image: null,
  });

  const { NFTContract, account } = useContext(WebThreeContext);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);

  const openModal = (id) => {
    setOpen(true);
    setids(id);
  };

  const openModal1 = (id) => {
    setOpen1(true);
    setids(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormValues({ ...formValues, [name]: e.target.files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e, parent) => {
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
      const metadataCID1 = `https://infura-ipfs.io/ipfs/${metadataCID.path.toString()}`;

      const tx = await NFTContract.createLeafToken(parent, metadataCID1);
      await tx.wait();
      console.log(tx);
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
      console.log(weiAmount);
      const transaction = await NFTContract.createPoll(ids, weiAmount);
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

  const loadNFTs = async () => {
    setIsLoading(true);
    const data = await NFTContract.fetchLeafItem();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await i.artURL;
        const meta = await axios.get(tokenUri);
        let item = {
          tokenId: i._leafId.toNumber(),
          seller: i.creator,
          parentId: i.Parent.toNumber(),
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
          <LoadingSpinner />
        ) : (
          nfts.map((nft, i) => (
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
                  image={nft.image}
                />

                <CardContent className="miniCard">
                  <Typography gutterBottom variant="body1" component="div">
                    <span style={{ fontWeight: 900 }}>LeafID</span> :{" "}
                    {nft.tokenId}
                  </Typography>
                  <Typography gutterBottom variant="body1" component="div">
                    <span style={{ fontWeight: 900 }}>ParentId</span> :{" "}
                    {nft.parentId}
                  </Typography>

                  <Typography gutterBottom variant="body1" component="div">
                    <span style={{ fontWeight: 900 }}>Name</span> : {nft.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <span style={{ fontWeight: 700 }}>Description</span> :{" "}
                    {nft.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginTop: "7px" }}
                  >
                    <span style={{ fontWeight: 700 }}>Acknowledge</span> :{" "}
                    {nft.acknowledge}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button size="small" onClick={() => openModal(nft.tokenId)}>
                    Create Leaf
                  </Button>
                  <Button size="small" onClick={() => openModal1(nft.tokenId)}>
                    Create Poll
                  </Button>
                 
                </CardActions>
                

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={(e) => handleSubmit(e, ids)}>
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
                        Create Poll{ids}
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
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default LeafNFT;
