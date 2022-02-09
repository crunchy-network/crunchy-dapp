import { gatherAllProjectJsonFiles } from "../../lib/JsonHelper";
export const projects = gatherAllProjectJsonFiles();

export const getCurrContractId = () => {
  const ref = window.location.href.split("/");
  const name = ref[ref.length - 1];

  const p = projects.find((p) => p.tokenName === name);
  return p ? p.contractId : undefined;
};
