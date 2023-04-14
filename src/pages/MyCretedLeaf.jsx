import React, { useState, useContext, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { WebThreeContext } from "../utils/ContextContract";
import axios from "axios";
import LoadingSpinner from "../utils/Spinner";
import { Grid } from "@mui/material";




const MyCreatedLeaf = () => {

  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { NFTContract, account } = useContext(WebThreeContext);
 
  const loadNFTs = async () => {
    setIsLoading(true);
    const data = await NFTContract.fetchItemsCreated();
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

                <CardContent className="miniCard1">
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
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}

export default MyCreatedLeaf