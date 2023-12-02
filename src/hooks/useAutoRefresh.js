"use client";
import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import getWeb3 from "@/utils/getWeb3";
import { networkSwitcher } from "@/utils/networkSwitcher";

const useAutoRefresh = () => {
  const { connector, chainId, account, provider } = useWeb3React();

  useEffect(() => {
    const connectedWallet = localStorage.getItem("connectedWallet");

    if (connectedWallet === "metamask") {
      if (connector.connectEagerly) {
        connector.connectEagerly().catch((error) => {
          console.log("Failed to connect eagerly to connector", error);
        });
      } else {
        connector.activate().catch()((error) => {
          console.log("Failed to connect catch to connector", error);
        });
      }
    }
  }, []);

  useEffect(() => {
    const assignWeb3 = async () => {
      window.web3 = await getWeb3(provider, chainId);
    };
    if (account && provider) {
      assignWeb3();
    }
  }, [account, provider]);

  useEffect(() => {
    if ((chainId === 97 && account) || typeof chainId === "undefined") {
      // do nothing
    } else {
      alert("Only Supports BSCT");
      networkSwitcher();
    }
  }, [chainId]);
};

export default useAutoRefresh;
