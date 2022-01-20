import MyEthMetaClient from "myethmeta";

(async () => {
    let x = new MyEthMetaClient()
    console.log(await x.getMetaData("0x5e8ba2ae8d293e73248448ebe39840aba6bd2269"));
})();
