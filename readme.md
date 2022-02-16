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

This is based off of ve(3,3)

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


### Mumbai mumbai deployment

| Name | Address |
| :--- | :--- |
| wMATIC| [0x99B92f7b3C65152Eb7654b7e0bdb08C659077CaA](https://mumbai.polygonscan.com/address/0x99B92f7b3C65152Eb7654b7e0bdb08C659077CaA#code) |
| USDT| [0x801FC386bd0a7998EE162ffF32b793D0624f3476](https://mumbai.polygonscan.com/address/0x801FC386bd0a7998EE162ffF32b793D0624f3476#code) |
| MIM | [0xe0695CD828B63C0E4b70fdD44d0f066560EE8CfE](https://mumbai.polygonscan.com/address/0xe0695CD828B63C0E4b70fdD44d0f066560EE8CfE#code) |
| DAI | [0x1ac7b60D5dDeB00DF64C992c8c760463250Ca158](https://mumbai.polygonscan.com/address/0x1ac7b60D5dDeB00DF64C992c8c760463250Ca158#code) |
| BaseV1 | [0xF11f46b9402aE94FC240DF9c09EdddEeccc7D8CB](https://mumbai.polygonscan.com/address/0xF11f46b9402aE94FC240DF9c09EdddEeccc7D8CB#code) |

| Name | Address |
| :--- | :--- |
| BaseV1Factory | [0x3Dabfe127098a12239345967BaA6B91eDD8a9072](https://mumbai.polygonscan.com/address/0x3Dabfe127098a12239345967BaA6B91eDD8a9072#code) |
| BaseV1BribeFactory | [0xe20624Ed8342D8f52E61C6966B674Bb4C3B4585e](https://mumbai.polygonscan.com/address/0xe20624Ed8342D8f52E61C6966B674Bb4C3B4585e#code) |
| BaseV1GaugesFactory | [0x6F7f5b43F289D222d74F8dDC6fc565e59c6A6bAB](https://mumbai.polygonscan.com/address/0x6F7f5b43F289D222d74F8dDC6fc565e59c6A6bAB#code) |
| BaseV1Router01 | [0x6CEbBAD4Ee8de812d1b9DF3139184d089572a8b5](https://mumbai.polygonscan.com/address/0x6CEbBAD4Ee8de812d1b9DF3139184d089572a8b5#code) |
| BaseV1Voter | [0x5bD12EA6fd6d08EBBf9892d586813e7656Ef54b0](https://mumbai.polygonscan.com/address/0x5bD12EA6fd6d08EBBf9892d586813e7656Ef54b0#code) |
| veNFT | [0x9Bb5589c7E62F38fb9fB28A0EC19Cf978C0e72CB](https://mumbai.polygonscan.com/address/0x9Bb5589c7E62F38fb9fB28A0EC19Cf978C0e72CB#code) |
| veNFT-dist | [0x324c10eB66B3c0ac7268FD92c48c66B230a4faC9](https://mumbai.polygonscan.com/address/0x324c10eB66B3c0ac7268FD92c48c66B230a4faC9#code) |
| BaseV1Minter | [0xd2F28beC4f7dA3fFF7F8135769B0d7EE4E785704](https://mumbai.polygonscan.com/address/0xd2F28beC4f7dA3fFF7F8135769B0d7EE4E785704#code) |

