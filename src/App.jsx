
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
const contractAddress = "0x72E9c077004cedFdA96A551A93939E9D18b66df7";
const contractABI = abi.abi;
let messageSent;
const get_all_waves = async() =>{
  try{
    const {ethereum} = window;
    if(ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const wavePortalContract =  new ethers.Contract(contractAddress, contractABI, signer);  

      const waves = await wavePortalContract.get_all_waves();

      let wavesCleaned = [];
      waves.forEach(wave=> {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp *1000),
          message: wave.message
        });
      });
      
      setAllWaves(wavesCleaned);
      }else{
        console.log("Ethereum object doesn't exist.");
      }
  }
    catch(error){
        console.log(error);
    }
  
}

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please install metamask!");
        return;
      } else {
        console.log("Ethereum object found! ", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        get_all_waves();
      } else {
        console.log("No authorized account found!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      if(alert('Reload the page to see messages!')){}
    else   
      window.location.reload();

      
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.gettotalwaves();
        console.log("Retrieved total wave count...", count.toNumber());
            messageSent = document.getElementById('msge').value;
        messageSent = document.getElementById('msge').value;
    

        const waveTxn = await wavePortalContract.wave(messageSent);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

  count = await wavePortalContract.gettotalwaves();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        😎 Hey there!
        </div>

        <div className="bio">
         <p className ="boomboom"> I am Shubh, welcome to my Dapp. </p>
        <p className ="boomboom">  Connect your Ethereum wallet to send a message to me!</p>
        </div>
       <form>
        <input type="text" className="textBox" placeholder = "Type here..." id="msge" ></input>
         </form>
        <button className="waveButton" onClick={wave}>
          Send!
        </button>
        {/*
        * If there is no currentAccount render this button
        */}
        
        {!currentAccount && (
          <button className="ConnectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
            <h2>Total messages:  <span id ="heading2"></span></h2>
            <h2><span id ="cnt"></span></h2>

                <p id="disappear" className="deez">Messages will be shown once you have authenticated with metamask!</p>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "#686868", marginTop: "16px",marginBottom:"16px",padding: "12px" }}>
             <div className="messsageChange"> Message: {wave.message}</div>
              <div className="messageChange">From: {wave.address}</div>
              <div className="messageChange">Time: {wave.timestamp.toString()}</div>
              
            </div>)
        })}

      </div>
    </div>
  );
}

export default App