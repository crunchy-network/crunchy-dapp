
import {gatherAllProjectJsonFiles} from '../../lib/JsonHelper'
export const projects = gatherAllProjectJsonFiles()

export const getCurrContractId = () => {
  let ref = window.location.href.split("/");
  let name = ref[ref.length -1 ];

  let p =  projects.find(p => p.tokenName === name);
  return p ? p.contractId : undefined
}


