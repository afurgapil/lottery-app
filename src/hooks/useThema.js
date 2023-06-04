import { useSelector } from "react-redux";

export const useThema = () => {
  const thema = useSelector((state) => state.thema.thema);
  return thema;
};
