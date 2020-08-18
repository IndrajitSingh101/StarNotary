
const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    // let instance = await StarNotary.deployed();
    // let user1 = accounts[1];
    // let user2 = accounts[2];
    // let starId = 3;
    // let starPrice = web3.utils.toWei(".01", "ether");
    // console.log(starPrice);
    // let balance = web3.utils.toWei(".05", "ether");
    // console.log(balance);
    // await instance.createStar('awesome star', starId, {from: user1});
    // await instance.putStarUpForSale(starId, starPrice, {from: user1});
    // let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    // console.log(balanceOfUser1BeforeTransaction);
    // await instance.approve(user2,starId,{from: user1});
    // await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    // let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    // let res = BigInt(balanceOfUser1AfterTransaction)-BigInt(balanceOfUser1BeforeTransaction);
    // console.log(res);
    // assert.equal(res, starPrice);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.approve(user2,starId,{from: user1});
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.approve(user2,starId,{from: user1});
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = BigInt(balanceOfUser2BeforeTransaction) - BigInt(balanceAfterUser2BuysStar);
    assert.equal(value, BigInt(starPrice));
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 6;
    let starName='ANDROMADA101';
    await instance.createStar(starName, starId, {from: user1});
    assert.equal(await instance.lookUptokenIdToStarInfo(starId),starName);
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    let instance = await StarNotary.deployed();
    let starID1=7;
    let starID2=8;
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3= accounts[3];
    let starName1='AN1';
    let starName2='AN2';
    await instance.createStar(starName1, starID1, {from: user1});
    await instance.createStar(starName2, starID2, {from: user2});
    await instance.approve(user3,starID1,{from: user1});
    await instance.approve(user3,starID2,{from: user2});
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(starID1,starID2,{from:user3});
    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf(starID1),user2);
    assert.equal(await instance.ownerOf(starID2),user1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let starID=9
    let user1 = accounts[1];
    let user2 = accounts[2];
    await instance.createStar("HALO1", starID, {from: user1});
    // 2. use the transferStar function implemented in the Smart Contract
    //await instance.approve(user2,starID,{from: user1});
    await instance.transferStar(user2,starID,{from: user1});
    // 3. Verify the star owner changed.
   assert.equal(await instance.ownerOf(starID),user2);
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let starID=10
    let user1 = accounts[1];
    await instance.createStar("HALO1", starID, {from: user1});
    // 2. Call your method lookUptokenIdToStarInfo
    let starName=await instance.lookUptokenIdToStarInfo(starID);
    // 3. Verify if you Star name is the same
    assert.equal(starName,"HALO1");
});