import { useSelector } from "react-redux";

export const useManager = () => {
  const manager = useSelector((state) => state.data.manager);
  return manager;
};
