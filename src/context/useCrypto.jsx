import { useContext } from "react";
import { CryptoContext } from "./CryptoContextValue";

export function useCrypto() {
  return useContext(CryptoContext);
}
