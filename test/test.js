const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const setupContract = async () => {
  const RentableNFT = await ethers.getContractFactory("RentableNFT");
  const rentableNFT = await RentableNFT.deploy("RentableNFT", "RNFT");
  await rentableNFT.deployed();
  return rentableNFT;
};

const setupAccounts = async () => {
  const accounts = await ethers.getSigners();
  return [accounts[0], accounts[1]];
};

it("RentableNFT contract is deployed", async () => {
  const rentableNFT = await setupContract();
  expect(rentableNFT.address).to.not.equal(undefined);
});

it("Rent flow", async () => {
  const rentableNFT = await setupContract();
  const [owner, renter] = await setupAccounts();

  // mint tokenId 0 to owner
  const tx = await rentableNFT.connect(owner).mint(0, owner.address);
  await tx.wait();

  // check owner of tokenId 0
  const ownerOf = await rentableNFT.ownerOf(0);
  expect(ownerOf).to.equal(owner.address);

  // rent the nft to renter for 1 hour
  const expiryTimestamp = Math.round(new Date().getTime() / 1000) + 3600;
  const tx2 = await rentableNFT
    .connect(owner)
    .rentOut(0, renter.address, expiryTimestamp);
  await tx2.wait();

  // check 'renter i.e. 'user' of tokenId 0
  const renterOf = await rentableNFT.userOf(0);
  expect(renterOf).to.equal(renter.address);

  // fast forward the chain to 2 hours later and check if the nft is still rented
  await network.provider.send("evm_increaseTime", [3601]);
  await network.provider.send("evm_mine");

  // check 'renter i.e. 'user' of tokenId 0
  const renterOf2 = await rentableNFT.userOf(0);
  expect(renterOf2).to.not.equal(renter.address);
  expect(renterOf2).to.equal("0x0000000000000000000000000000000000000000");
});
