import React, { createContext, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import NFTAbi from "../utils/ABI/NFT.json";
import MarketAbi from "../utils/ABI/NFTMarketPlace.json";
import { NFTContractAddress, NFTMarketPlaceAddress } from "./ContractAddress";

export const WebThreeContext = createContext();

const ContextContract = ({ children }) => {
  const [account, setaccount] = useState();
  const [balance, setbalance] = useState();
  const [NFTContract, setNFTContract] = useState();
  const [NFTMarket, setNFTMarket] = useState();

  const connectWallet = async () => {
    const chainId = {mainnet:137,testnet:80001}; // Polygon Mainnet

    if (window.ethereum.networkVersion !== chainId.testnet) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(chainId.testnet) }],
      });
    }

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: "mainnet",
      providerOptions,
    });

    const externalProvider = await newWeb3Modal.connect();
    const provider = new ethers.providers.Web3Provider(externalProvider);
    const signer = await provider.getSigner();
    const Address = await signer.getAddress();
    setaccount(Address);
    const balances = provider.getBalance(Address);
    setbalance(balances);

    const nftContract = new ethers.Contract(
      NFTContractAddress,
      NFTAbi.abi,
      signer
    );
    setNFTContract(nftContract);

    const nftMarket = new ethers.Contract(
      NFTMarketPlaceAddress,
      MarketAbi.abi,
      signer
    );
    setNFTMarket(nftMarket);
  };

  return (
    <>
      <WebThreeContext.Provider
        value={{ connectWallet, account, balance, NFTContract, NFTMarket }}
      >
        <div>{children}</div>
      </WebThreeContext.Provider>
    </>
  );
};

export default ContextContract;
