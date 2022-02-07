async function main() {

    [owner, owner2, owner3] = await ethers.getSigners(3);

    const token = await ethers.getContractFactory("Token");

    const ust = await token.deploy('ust', 'ust', 6, owner.address);
    const mim = await token.deploy('mim', 'mim', 18, owner.address);
    const dai = await token.deploy('DAI', 'DAI', 18, owner.address);
   
  
    console.log(ust.address,mim.address,dai.address)

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  