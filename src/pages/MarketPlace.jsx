import React, { useState, useContext, useEffect } from "react";
import { WebThreeContext } from "../utils/ContextContract";
import axios from "axios";
import LoadingSpinner from "../utils/Spinner";
import { Grid} from "@mui/material";
import MYNFT from "./MYNFT.jsx"

const LeafNFT = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { NFTContract, account } = useContext(WebThreeContext);

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
            <MYNFT 
              i={i}
              image = {nft.image}
              tokenId = {nft.tokenId}
              parentId = {nft.parentId}
              name={nft.name}
              description={nft.description}
              acknowledge={nft.acknowledge}
            />
          ))
        )}
      </Grid>
    </>
  );
};

export default LeafNFT;
