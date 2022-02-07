ACCURE allows low cost, near 0 slippage trades on uncorrelated or tightly correlated assets. The protocol incentivizes fees instead of liquidity. Liquidity providers (LPs) are given incentives in the form of `token`, the amount received is calculated as follows;

* 100% of weekly distribution weighted on votes from ve-token holders

The above is distributed to the `gauge` (see below), however LPs will earn between 40% and 100% based on their own ve-token balance.

LPs with 0 ve* balance, will earn a maximum of 40%.

## AMM

What differentiates ACCURE's AMM;

ACCURE AMMs are compatible with all the standard features as popularized by Uniswap V2, these include;

* Lazy LP management
* Fungible LP positions
* Chained swaps to route between pairs
* priceCumulativeLast that can be used as external TWAP
* Flashloan proof TWAP
* Direct LP rewards via `skim`
* xy>=k

ACCURE adds on the following features;

* 0 upkeep 30 minute TWAPs. This means no additional upkeep is required, you can quote directly from the pair
* Fee split. Fees do not auto accrue, this allows external protocols to be able to profit from the fee claim
* New curve: x3y+y3x, which allows efficient stable swaps
* Curve quoting: `y = (sqrt((27 a^3 b x^2 + 27 a b^3 x^2)^2 + 108 x^12) + 27 a^3 b x^2 + 27 a b^3 x^2)^(1/3)/(3 2^(1/3) x) - (2^(1/3) x^3)/(sqrt((27 a^3 b x^2 + 27 a b^3 x^2)^2 + 108 x^12) + 27 a^3 b x^2 + 27 a b^3 x^2)^(1/3)`
* Routing through both stable and volatile pairs
* Flashloan proof reserve quoting

## token

**TBD**

## ve-token

Vested Escrow (ve), this is the core voting mechanism of the system, used by `BaseV1Factory` for gauge rewards and gauge voting.

This is based off of ve(3,3) as proposed [here](https://andrecronje.medium.com/ve-3-3-44466eaa088b)

* `deposit_for` deposits on behalf of
* `emit Transfer` to allow compatibility with third party explorers
* balance is moved to `tokenId` instead of `address`
* Locks are unique as NFTs, and not on a per `address` basis

```
function balanceOfNFT(uint) external returns (uint)
```

## BaseV1Pair

Base V1 pair is the base pair, referred to as a `pool`, it holds two (2) closely correlated assets (example MIM-UST) if a stable pool or two (2) uncorrelated assets (example FTM-SPELL) if not a stable pool, it uses the standard UniswapV2Pair interface for UI & analytics compatibility.

```
function mint(address to) external returns (uint liquidity)
function burn(address to) external returns (uint amount0, uint amount1)
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external
```

Functions should not be referenced directly, should be interacted with via the BaseV1Router

Fees are not accrued in the base pair themselves, but are transfered to `BaseV1Fees` which has a 1:1 relationship with `BaseV1Pair`

### BaseV1Factory

Base V1 factory allows for the creation of `pools` via ```function createPair(address tokenA, address tokenB, bool stable) external returns (address pair)```

Base V1 factory uses an immutable pattern to create pairs, further reducing the gas costs involved in swaps

Anyone can create a pool permissionlessly.

### BaseV1Router

Base V1 router is a wrapper contract and the default entry point into Stable V1 pools.

```

function addLiquidity(
    address tokenA,
    address tokenB,
    bool stable,
    uint amountADesired,
    uint amountBDesired,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
) external ensure(deadline) returns (uint amountA, uint amountB, uint liquidity)

function removeLiquidity(
    address tokenA,
    address tokenB,
    bool stable,
    uint liquidity,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
) public ensure(deadline) returns (uint amountA, uint amountB)

function swapExactTokensForTokens(
    uint amountIn,
    uint amountOutMin,
    route[] calldata routes,
    address to,
    uint deadline
) external ensure(deadline) returns (uint[] memory amounts)

```

## Gauge

Gauges distribute arbitrary `token(s)` rewards to BaseV1Pair LPs based on voting weights as defined by `ve` voters.

Arbitrary rewards can be added permissionlessly via ```function notifyRewardAmount(address token, uint amount) external```

Gauges are completely overhauled to separate reward calculations from deposit and withdraw. This further protect LP while allowing for infinite token calculations.

Previous iterations would track rewardPerToken as a shift everytime either totalSupply, rewardRate, or time changed. Instead we track each individually as a checkpoint and then iterate and calculation.

## Bribe

Gauge bribes are natively supported by the protocol, Bribes inherit from Gauges and are automatically adjusted on votes.

Users that voted can claim their bribes via calling ```function getReward(address token) public```

Fees accrued by `Gauges` are distributed to `Bribes`

### BaseV1Voter

Gauge factory permissionlessly creates gauges for `pools` created by `BaseV1Factory`. Further it handles voting for 100% of the incentives to `pools`.

```
function vote(address[] calldata _poolVote, uint[] calldata _weights) external
function distribute(address token) external
```

### veNFT distribution recipients

| Name | Address | Qty |
| :--- | :--- | :--- |
| Multichain | 0x5bDacBaE440A2F30af96147DE964CC97FE283305 | 800000 |
| 0xDAO | 0xa96D2F0978E317e7a97aDFf7b5A76F4600916021 | 2376588 |
| SpookySwap | 0x95478C4F7D22D1048F46100001c2C69D2BA57380 | 1331994 |
| Yearn Finance | 0xC0E2830724C946a6748dDFE09753613cd38f6767 | 1118072 |
| veDAO | 0x3293cB515Dbc8E0A8Ab83f1E5F5f3CC2F6bbc7ba | 1070472 |
| Curve | 0xffFfBBB50c131E664Ef375421094995C59808c97 | 1023840 |
| Tomb Finance | 0x02517411F32ac2481753aD3045cA19D58e448A01 | 864361 |
| Geist Finance | 0xf332789fae0d1d6f058bfb040b3c060d76d06574 | 812928 |
| Beefy Finance | 0xdFf234670038dEfB2115Cf103F86dA5fB7CfD2D2 | 795726 |
| RenVM | 0x0f2A144d711E7390d72BD474653170B201D504C8 | 763362 |
| Synapse | 0x224002428cF0BA45590e0022DF4b06653058F22F | 727329 |
| Radial | 0x26D70e4871EF565ef8C428e8782F1890B9255367 | 688233 |
| Iron Bank | 0xA5fC0BbfcD05827ed582869b7254b6f141BA84Eb | 681101 |
| SpiritSwap | 0x4D5362dd18Ea4Ba880c829B0152B7Ba371741E59 | 677507 |
| Scream | 0x1e26D95599797f1cD24577ea91D99a9c97cf9C09 | 676304 |
| Abracadabra | 0xb4ad8B57Bd6963912c80FCbb6Baea99988543c1c | 642992 |
| SushiSwap | 0xF9E7d4c6d36ca311566f46c81E572102A2DC9F52 | 609195 |
| Frax | 0xE838c61635dd1D41952c68E47159329443283d90 | 598412 |
| Reaper Farm | 0x111731A388743a75CF60CCA7b140C58e41D83635 | 591573 |
| Beethoven X | 0x0edfcc1b8d082cd46d13db694b849d7d8151c6d5 | 587431 |
| Hundred Finance | 0xD0Bb8e4E4Dd5FDCD5D54f78263F5Ec8f33da4C95 | 542785 |
| Morpheus Swap | 0x9685c79e7572faF11220d0F3a1C1ffF8B74fDc65 | 536754 |
| Saddle | 0xa70b1d5956DAb595E47a1Be7dE8FaA504851D3c5 | 518240 |
| Liquid Driver | 0x06917EFCE692CAD37A77a50B9BEEF6f4Cdd36422 | 511920 |
| Tarot | 0x5b0390bccCa1F040d8993eB6e4ce8DeD93721765 | 452870 |

### Testnet deployment

| Name | Address |
| :--- | :--- |
| wFTM| [0x27Ce41c3cb9AdB5Edb2d8bE253A1c6A64Db8c96d](https://testnet.ftmscan.com/address/0x27Ce41c3cb9AdB5Edb2d8bE253A1c6A64Db8c96d#code) |
| USDT| [0x8ad96050318043166114884b59E2fc82210273b3](https://testnet.ftmscan.com/address/0x8ad96050318043166114884b59E2fc82210273b3#code) |
| MIM | [0x976e33B07565b0c05B08b2e13AfFD3113e3D178d](https://testnet.ftmscan.com/address/0x976e33B07565b0c05B08b2e13AfFD3113e3D178d#code) |
| BaseV1 | [0x061a017847A7baB75aC52b99eAb22A19d50F44eb](https://testnet.ftmscan.com/address/0x061a017847A7baB75aC52b99eAb22A19d50F44eb#code) |

| Name | Address |
| :--- | :--- |
| BaseV1Factory | [0xe6367958e8297cb8bdC4B99BC15Ae402Ebf41baA](https://testnet.ftmscan.com/address/0xe6367958e8297cb8bdC4B99BC15Ae402Ebf41baA#code) |
| BaseV1BribeFactory | [0x409Ae97fBFb9Aff407766B40a9c170DC9cc1aC76](https://testnet.ftmscan.com/address/0x409Ae97fBFb9Aff407766B40a9c170DC9cc1aC76#code) |
| BaseV1GaugesFactory | [0x572346756f961c379888235dd950CFB6a4496b17](https://testnet.ftmscan.com/address/0x572346756f961c379888235dd950CFB6a4496b17#code) |
| BaseV1Router01 | [0x04583f12bF185f11d1B3783894Acaa29dCE6547A](https://testnet.ftmscan.com/address/0x04583f12bF185f11d1B3783894Acaa29dCE6547A#code) |
| BaseV1Voter | [0x3c137d25FAC210C211Eb523da31542B8A115f7F8](https://testnet.ftmscan.com/address/0x3c137d25FAC210C211Eb523da31542B8A115f7F8#code) |
| veNFT | [0xDa38D8c66e7b3190f98570b7965A8825BDdfee6D](https://testnet.ftmscan.com/address/0xDa38D8c66e7b3190f98570b7965A8825BDdfee6D#code) |
| veNFT-dist | [0x2D8c86F8D47511D92E40B370A43c45b1d2C9805B](https://testnet.ftmscan.com/address/0x2D8c86F8D47511D92E40B370A43c45b1d2C9805B#code) |
| BaseV1Minter | [0x190305e3D36648613572c5dCD366bcD496e9c75D](https://testnet.ftmscan.com/address/0x190305e3D36648613572c5dCD366bcD496e9c75D#code) |

### Mainnet RC0.0

| Name | Address |
| :--- | :--- |
| wFTM| [0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83](https://ftmscan.com/address/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83#code) |
| Solid | [0xBB5298e572519DaE7784f533B5E76F37855b1A4A](https://ftmscan.com/address/0xBB5298e572519DaE7784f533B5E76F37855b1A4A#code) |
| BaseV1Factory | [0x117F6F61e797E411Ea92F0ea1555c397Ecf17939](https://ftmscan.com/address/0x117F6F61e797E411Ea92F0ea1555c397Ecf17939#code) |
| BaseV1GaugesFactory | [0xb8F4176Ed6f251fF24F50d17A3BFA6852FeF13bD](https://ftmscan.com/address/0xb8F4176Ed6f251fF24F50d17A3BFA6852FeF13bD#code) |
| BaseV1Router01 | [0xCAE00F31F7cB5A78450Ca119fc2D0e7bbaEF0439](https://ftmscan.com/address/0xCAE00F31F7cB5A78450Ca119fc2D0e7bbaEF0439#code) |
| BaseV1Voter | [0xfF61f4aC23a3d8b5D1f21C231282A96deF3855D6](https://ftmscan.com/address/0xfF61f4aC23a3d8b5D1f21C231282A96deF3855D6#code) |
| veNFT | [0xC34A4644Bb1deea88e4045Ce3C38A0261E41FC9f](https://ftmscan.com/address/0xC34A4644Bb1deea88e4045Ce3C38A0261E41FC9f#code) |
| veNFT-dist | [0xA4229Db9b0bAB36b212ABe09C4Be1b76E5629906](https://ftmscan.com/address/0xA4229Db9b0bAB36b212ABe09C4Be1b76E5629906#code) |
| BaseV1Minter | [0x5778F4c3AC8A26Bf44cEc570b2b5536B148475B8](https://ftmscan.com/address/0x5778F4c3AC8A26Bf44cEc570b2b5536B148475B8#code) |

