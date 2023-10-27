import { useContext } from "react";
import { SeekerContext } from "../context/SeekerContext";

export const useSeeker = () => {
  return useContext(SeekerContext);
};