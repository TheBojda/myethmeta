# JavaScript library for MyEthMeta

Simple, zero dependency library for accessing metadata that is attached to your Ethereum address. 
For more info, visit https://myethmeta.org/

## Installation

Install this package by `npm i myethmeta`

## Usage

```javascript
const client = new MyEthMetaClient()
const metadata = await client.getMetaData(eth_address)

image.src = metadata.thumbnailUrl // show profile picture
```
