import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }
    this.createPost = this.createPost.bind(this);
  }
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // load accounts
    const accounts = await web3.eth.getAccounts()
    this.setState({ accounts: accounts[0] })
    // Network // ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]

    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      // Load posts
      for(var i = 1; i <= postCount; i++){
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({ posts:[...this.state.posts, post]})
      }
      this.setState({ loading: false })
    }else {
      window.alert('SocialNetwork contract not deployed to detected network')
    }
    // Address
    // ABI
  }
  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.accounts}).once('receipt', (receipt) => {
      this.setState({ loading: false})
    })
  }
  render() {
    return (
      <div>
        <Navbar account={this.state.accounts} />
        { this.state.loading
          ?
          <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          :
          <Main posts={this.state.posts} createPost={this.createPost}/>
        }
      </div>
    )
  }
}

export default App;
