import MyEthMetaClient from "myethmeta";

(async () => {
    let client = new MyEthMetaClient()
    let params = new URLSearchParams(location.search)
    console.log(await client.getMetaData(params.get("address")));
})();
