import { useSelector } from "react-redux";

export const useWinner = () => {
  const winner = useSelector((state) => state.data.winner);
  return winner;
};
