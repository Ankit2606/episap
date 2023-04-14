import { connectors } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import math from "../assets/images/math.jpeg"
import safepal from "../assets/images/safepal.png"
import binance from "../assets/images/binance.jpg"
import trust from "../assets/images/trust.png"

export const providerOptions = {
  /* See Provider Options Section */
  injected: {
    display: {
      name: "Metamask",
      description: "Metamask",
    //   logo: bnbwlt
    }
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: "https://bsc-dataseed.binance.org/",
        56: "https://bsc-dataseed.binance.org/"
      }
    }
  },
  "custom-binance": {
    display: {
      name: "Binance",
      description: "Binance Chain Wallet",
      logo: binance
    },
    package: "binance",
    connector: async (ProviderPackage, options) => {
      let provider = window.BinanceChain;
      provider.autoRefreshOnNetworkChange = true;
      await provider.enable();
      return provider;
    }
  },
  "custom-math": {
    display: {
      name: "Math",
      description: "Math Wallet",
      logo: math
    },
    package: "math",
    connector: connectors.injected
  },
  "custom-twt": {
    display: {
      name: "Trust",
      description: "Trust Wallet",
      logo: trust
    },
    package: "twt",
    connector: connectors.injected
  },
  "custom-safepal": {
    display: {
      name: "SafePal",
      description: "SafePal App",
      logo: safepal
    },
    package: "safepal",
    connector: connectors.injected
  }
};