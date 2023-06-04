import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useContract } from "../hooks/useContract";
import { useAddress } from "../hooks/useAddress";
import { useWinner } from "../hooks/useWinner";
import { formatEther } from "ethers/lib/utils";
import "../style/Homepage.scss";
import ModalComponent from "../components/Modal";
import customStyles from "../style/customStyles";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");
function Homepage() {
  const adres = useAddress();
  const winner = useWinner();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lotteryName, setLotteryName] = useState();
  const [entered, setEntered] = useState(null);
  const [balance, setBalance] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const lotteryContract = useContract();

  useEffect(() => {
    const checkEntered = async () => {
      try {
        if (lotteryContract && adres) {
          const txn = await lotteryContract.hasEntered(adres);
          setEntered(txn);
        }
      } catch (error) {
        console.error("Error checkEntered:", error);
      }
    };

    const fetchPlayers = async () => {
      try {
        if (lotteryContract) {
          const fetchedPlayers = await lotteryContract.getPlayers();
          setPlayers(fetchedPlayers);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching players:", error);
        setLoading(false);
      }
    };

    const getLotteryName = async () => {
      try {
        if (lotteryContract) {
          const txn = await lotteryContract.lotteryName();
          setLotteryName(txn);
        }
      } catch (error) {
        console.error("Error getLotteryName:", error);
      }
    };
    const getBalance = async () => {
      try {
        if (lotteryContract) {
          const txn = await lotteryContract.getContractBalance();
          const balanceDecimal = formatEther(txn);
          setBalance(balanceDecimal);
        }
      } catch (error) {
        console.error("Error fetching getBalance:", error);
      }
    };

    getLotteryName();
    checkEntered();
    getBalance();

    const interval = setInterval(fetchPlayers, 1000);

    return () => clearInterval(interval);
  }, [lotteryContract, adres]);

  const enter = async () => {
    try {
      if (lotteryContract) {
        setIsOpen(true);
        const txn = await lotteryContract.enter();
        await txn.wait();
        setEntered(true);
        setIsOpen(false);
      }
    } catch (error) {
      showErrorNotification(
        "An error occurred while participating in the draw"
      );

      setIsOpen(false);
    }
  };
  const handleClose = () => setIsOpen(false);
  const showErrorNotification = (errorMessage) => {
    toast.error(errorMessage);
  };
  return (
    <div className="Homepage">
      <>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleClose}
          style={customStyles}
        >
          <ModalComponent handleClose={handleClose} />
        </Modal>
        <ToastContainer position="top-right" autoClose={5000} />
      </>
      <div className="enter">
        {lotteryName && <p>Current Lottery: {lotteryName}</p>}
        {balance > 0 && (
          <p className="balance">Current Balance: {balance} Matic</p>
        )}
        <button
          className={`enter-button ${entered ? "entered" : "notentered"}`}
          onClick={enter}
        >
          {entered ? "You Entered" : "Enter"}
        </button>
      </div>
      <div className="desc">
        <div className="desc__item users">
          <h2>Participants</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {players.length > 0 ? (
                <ul className="users-container">
                  {players.map((player, index) => (
                    <li className="user" key={index}>{`${player.substring(
                      0,
                      15
                    )}...`}</li>
                  ))}
                </ul>
              ) : (
                <p>No participants yet</p>
              )}
            </>
          )}
        </div>
        <div className="desc__item rules">
          <h2>Rules</h2>
          <ul>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
          </ul>
        </div>
      </div>
      <div className="winner">{winner && <p>Last Winner: {winner}...</p>}</div>
    </div>
  );
}

export default Homepage;
