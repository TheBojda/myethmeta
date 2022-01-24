import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import 'github-fork-ribbon-css/gh-fork-ribbon.css';

import detectEthereumProvider from "@metamask/detect-provider";

document.getElementById('createProfileButton')?.addEventListener('click', async (event) => {
    const ethereum: any = await detectEthereumProvider();
    if (ethereum) {
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        const account = accounts[0];
        window.location.href = `https://profile.myethmeta.org/#${account}/edit`;
    } else {
        alert("Please install MetaMask or use a web3 browser!");
    }
});