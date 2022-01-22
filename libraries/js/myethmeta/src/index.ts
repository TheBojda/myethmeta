import { EthereumAddressMetadataJSONSchema } from "./myethmeta-schema"

const CONTRACT_ADDRESS = "0x63Ba8dfAEBa09a63c1bCB47a46229f14707Af995";
const POLYGON_RPC_URL = "https://polygon-rpc.com/";

export default class MyEthMetaClient {

  private requestId = 1;

  constructor() { }

  private hexToBytes(hex: string): number[] {
    let bytes: number[] = [];
    for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substring(c, c + 2), 16));
    return bytes;
  }

  private async callContract(address: string) {
    const prefix = '0xd7f84684000000000000000000000000'; // firs 4 bytes of keccak('getMetaURI(address)') + 12 bytes for address zero padding
    const data = prefix + address.substring(2)
    const payload = {
      id: this.requestId,
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          data: data,
          to: CONTRACT_ADDRESS
        }, "latest"
      ]
    }
    const response = await fetch(POLYGON_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    this.requestId++;
    const json_result = await response.json();
    const result = json_result.result;
    const result_bytes = this.hexToBytes(result.substring(2)); // cut 0x
    let result_string_bytes = result_bytes.slice(32 + 31, result_bytes.length); // cut offset (return value is always a tuple) and zeros
    const string_length = result_string_bytes.shift(); // get string legth
    if (string_length == 0)
      return null;
    const string_bytes = result_string_bytes.slice(0, string_length); // get string data
    return String.fromCharCode(...string_bytes); // convert to string
  }

  public getGatewayURL(uri: string) {
    if (uri.startsWith("ipfs://"))
      return "https://cloudflare-ipfs.com/ipfs/" + uri.substring(7);
    return uri;
  }

  public async getMetaData(address: string): Promise<EthereumAddressMetadataJSONSchema> {
    const uri = await this.callContract(address);
    if (!uri)
      return {}
    const response = await fetch(this.getGatewayURL(uri));
    return await response.json();
  }

}

