import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import { EthereumAddressMetadataJSONSchema } from "./myethmeta-schema"
import myethmeta_abi from './myethmeta_abi.json'

const CONTRACT_ADDRESS = "0x63Ba8dfAEBa09a63c1bCB47a46229f14707Af995";

export default class MyEthMetaClient {

  private contract: Contract;

  constructor() {
    const web3 = new Web3((window as any).ethereum);
    this.contract = new web3.eth.Contract(myethmeta_abi as AbiItem[], CONTRACT_ADDRESS);
  }

  async getMetaData(address: string): Promise<EthereumAddressMetadataJSONSchema> {
    const uri = await this.contract.methods.getMetaURI(address).call();
    return uri;
  }

}

