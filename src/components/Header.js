import React, { useState, useEffect } from "react";
//ethers&contract
import { ethers } from "ethers";
import { LOTTERY_ADDRESS } from "../constants/addresses";
import { LOTTERY_ABI } from "../constants/abi";
//hooks
import { useProvider } from "../hooks/useProvider";
import { useSigner } from "../hooks/useSigner";
import { useAddress } from "../hooks/useAddress";
import { useContract } from "../hooks/useContract";
import { useThema } from "../hooks/useThema";
//redux
import { setLotteryContract } from "../store/slicers/contract";
import { batch, useDispatch } from "react-redux";
import {
  setAccount,
  setAddress,
  setProvider,
  setSigner,
  setManager,
} from "../store/slicers/data";
import { setThema } from "../store/slicers/thema";
import "../style/Header.scss";
import { Link } from "react-router-dom";
import { BiMoon, BiSun } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";

function Header() {
  const dispatch = useDispatch();
  const provider = useProvider();
  const signer = useSigner();
  const address = useAddress();
  const lotteryContract = useContract();
  const themeMode = useThema();
  const [wallet, setWallet] = useState();

  useEffect(() => {
    if (!window.ethereum) {
      alert("Metamask is not installed");
      return;
    }

    const initialize = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const lotteryContract = new ethers.Contract(
          LOTTERY_ADDRESS,
          LOTTERY_ABI,
          signer
        );

        batch(() => {
          dispatch(setProvider(provider));
          dispatch(setLotteryContract(lotteryContract));
          dispatch(setSigner(signer));
        });
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initialize();
  }, [dispatch]);
  useEffect(() => {
    const prefersDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const prefersLightTheme = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    if (prefersDarkTheme) {
      dispatch(setThema("dark"));
    } else if (prefersLightTheme) {
      dispatch(setThema("light"));
    } else {
      dispatch(setThema("light"));
    }
  }, [dispatch]);
  const connect = async () => {
    if (!window.ethereum) {
      alert("Metamask is not installed");
      return;
    }
    if (!provider) return;
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      dispatch(setAccount(accounts[0]));

      const address = await signer.getAddress();
      const address2 = address.substring(0, 7);
      dispatch(setAddress(address));
      setWallet(address2);
      const manager = await lotteryContract.manager();
      dispatch(setManager(manager));
    } catch (error) {
      console.error("Error connecting:", error);
      showErrorNotification("cekilise katilirken bir hata olustu");
    }
  };
  const changeLight = () => {
    dispatch(setThema("light"));
  };
  const changeDark = () => {
    dispatch(setThema("dark"));
  };
  const showErrorNotification = (errorMessage) => {
    toast.error(errorMessage);
  };
  return (
    <header>
      <Link to="/" className="title">
        GapiLOT
      </Link>
      <div className="btn-container">
        <ToastContainer position="top-right" autoClose={5000} />
        <button
          className={`button ${address ? "connected" : "inconnect"}`}
          onClick={connect}
        >
          {address ? (
            <div className="wallet">
              <p>Connected</p>
              <p>{wallet}</p>
            </div>
          ) : (
            "Connect"
          )}
        </button>
        <button className="theme-btn">
          {themeMode === "dark" ? (
            <BiMoon onClick={changeLight} className="icon" />
          ) : (
            <BiSun onClick={changeDark} className="icon" />
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
