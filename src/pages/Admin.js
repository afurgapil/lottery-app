import React, { useState } from "react";
import Modal from "react-modal";
import { useContract } from "../hooks/useContract";
import { useWinner } from "../hooks/useWinner";
import "../style/Admin.scss";
import { useDispatch } from "react-redux";
import { setWinner } from "../store/slicers/data";
import customStyles from "../style/customStyles";
import ModalComponent from "../components/Modal";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");
function Admin() {
  const dispatch = useDispatch();
  const winner = useWinner();
  const lotteryContract = useContract();
  const [user, setUser] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [lotteryName, setLotteryName] = useState("");
  const [amount, setAmount] = useState("");
  const pickWinner = async () => {
    try {
      setIsOpen(true);
      const txn = await lotteryContract.pickWinner();
      await txn.wait();
      setIsOpen(false);
      try {
        const txn = await lotteryContract.getWinner();
        const subtxn = txn.substring(0, 10);
        dispatch(setWinner(subtxn));
      } catch (error) {
        showErrorNotification("An error occurred while getting the winner.");
      }
    } catch (error) {
      console.error("Error fetching pickWinner:", error);
      showErrorNotification("An error occurred while picking the winner.");
    }
  };

  const clearUser = async () => {
    try {
      setIsOpen(true);
      const txn = await lotteryContract.removePlayer(user);
      await txn.wait();
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching clearUser:", error);
      setIsOpen(false);
      showErrorNotification("An error occurred while removing the user.");
    }
  };
  const clearUsers = async () => {
    try {
      setIsOpen(true);
      const txn = await lotteryContract.clearPlayers();
      await txn.wait();
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching clearUsers:", error);
      setIsOpen(false);
      showErrorNotification("An error occurred while clearing users.");
    }
  };
  const changeLotteryName = async () => {
    try {
      setIsOpen(true);
      const txn = await lotteryContract.setLotteryName(lotteryName);
      await txn.wait();
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching changeLotteryName:", error);
      setIsOpen(false);
      showErrorNotification(
        "An error occurred while changing the lottery name."
      );
    }
  };

  const deposit = async () => {
    try {
      setIsOpen(true);
      const txn = await lotteryContract.deposit({ value: amount });
      await txn.wait();
      setIsOpen(false);
      setAmount(0);
    } catch (error) {
      showErrorNotification("An error occurred while clearing users.");
      setIsOpen(false);
    }
  };
  const handleClose = () => setIsOpen(false);
  const showErrorNotification = (errorMessage) => {
    toast.error(errorMessage);
  };
  return (
    <div className="admin-container">
      <>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleClose}
          style={customStyles}
        >
          <ModalComponent handleClose={handleClose} />
        </Modal>
      </>
      <ToastContainer position="top-right" autoClose={5000} />
      {winner && <p>Winner: {winner}</p>}
      <div className="pick-winner btn-container">
        <button className="pick-winner-btn" onClick={pickWinner}>
          Pick Winner
        </button>
      </div>
      <div className="remove-player btn-container">
        <input
          type="text"
          value={user}
          placeholder="User Address"
          onChange={(event) => setUser(event.target.value)}
        />
        <button className="remove-player-btn" onClick={clearUser}>
          Remove User
        </button>
      </div>
      <div className="remove-players btn-container">
        <button className="remove-players-btn" onClick={clearUsers}>
          Remove All Users
        </button>
      </div>
      <div className="change-lottery-name btn-container">
        <input
          type="text"
          value={lotteryName}
          placeholder="Lottery Name"
          onChange={(event) => setLotteryName(event.target.value)}
        />
        <button className="change-lottery-btn" onClick={changeLotteryName}>
          Change Name
        </button>
      </div>
      <div className="deposit btn-container">
        <input
          type="text"
          value={amount}
          placeholder="Deposit Amount"
          onChange={(event) => setAmount(event.target.value)}
        />
        <button className="deposit-btn" onClick={deposit}>
          Deposit
        </button>
      </div>
    </div>
  );
}

export default Admin;
