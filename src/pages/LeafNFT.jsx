import React, { useState, useEffect } from "react";
// import { WebThreeContext } from "../utils/ContextContract";
import axios from "axios";
import LoadingSpinner from "../utils/Spinner";
import { Grid } from "@mui/material";
import LeafData from "../components/LeafData";
import {ethers} from "ethers"
import NFTAbi from "../utils/ABI/NFT.json";
import { NFTContractAddress } from "../utils/ContractAddress";

const LeafNFT = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const { NFTContract, account } = useContext(WebThreeContext);

  const loadNFTs = async () => {
    setIsLoading(true);
    const provider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com');
    const contract =new ethers.Contract(
      NFTContractAddress,
      NFTAbi.abi,
      provider
      );
      const data = await contract.fetchLeafItem();
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
  }, []);

  return (
    <>
      <Grid container>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          nfts.map((nft, i) => (
            <LeafData
              i={i}
              image={nft.image}
              tokenId={nft.tokenId}
              parentId={nft.parentId}
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
