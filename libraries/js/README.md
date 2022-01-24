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

## Instructions for building the library

- Run `yarn` in the root folder
- Run `yarn build` in the myethmeta folder
- Run `yarn start` in the example folder

