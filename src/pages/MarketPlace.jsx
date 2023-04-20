import React, { useState, useEffect, useContext } from "react";
import { WebThreeContext } from "../utils/ContextContract";
import axios from "axios";
import LoadingSpinner from "../utils/Spinner";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import NFTMarketPlace from "../utils/ABI/NFTMarketPlace.json";
import NFT from "../utils/ABI/NFT.json";
import {
  NFTMarketPlaceAddress,
  NFTContractAddress,
} from "../utils/ContractAddress";
import { toast } from "react-toastify";

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

const MarketPlace = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { NFTMarket,tokenContract } = useContext(WebThreeContext);

  const loadNFTs = async () => {
    setIsLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://matic-mumbai.chainstacklabs.com"
    );
    const contract = new ethers.Contract(
      NFTMarketPlaceAddress,
      NFTMarketPlace.abi,
      provider
    );
    const nftcontract = new ethers.Contract(
      NFTContractAddress,
      NFT.abi,
      provider
    );
    const data = await contract.fetchMarketItems();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftcontract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          itemId: i.itemId.toNumber(),
          nftContract: `${i.nftContract.slice(0, 6)}...${i.nftContract.slice(
            -4
          )}`,
          seller: `${i.seller.slice(0, 6)}...${i.seller.slice(-4)}`,
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

  const nftBuy = async (price,id) => {
    try {
      const divprice = price/10
      const totalprice = parseInt(price)+parseInt(divprice)
      const weiValue = ethers.utils.parseEther(totalprice.toString()); 
      const transaction = await tokenContract.approve(NFTMarketPlaceAddress,weiValue);
      await transaction.wait()
      toast.success("successfully Approved ", {
        toster,
      });
      const tx = await NFTMarket.createMarketSale(id);
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

  useEffect(() => {
    loadNFTs();
  }, []);

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
                      
                      {nft.price} EPT
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
                      Seller
                    </span>
                    :
                    <span
                      style={{
                        fontFamily: "fantasy",
                        fontSize: "17px",
                        padding: "0px",
                      }}
                    >
                      
                      {nft.seller}
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
                        fontSize: "18px",
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
                        fontSize: "18px",
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
                        fontSize: "18px",
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
                    variant="contained"
                    size="medium"
                    sx={{ fontFamily: fontfamily }}
                    onClick={() => nftBuy(nft.price,nft.itemId)}
                  >
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default MarketPlace;
