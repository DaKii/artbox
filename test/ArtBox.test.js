const ArtBox = artifacts.require("ArtBox");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('artbox', async accounts =>{
    let artbox

    before(async() => {
        artbox = await ArtBox.deployed()
    })

    //Deployment
    describe('deployment', async() => {
        it('deploys sucessfully', async() =>{
            //Successs
            const address = await artbox.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async() => {
            //Success
            const name = await artbox.contractName()
            assert.equal(name, 'ArtBox')
        })
    })

    describe('artwork', async() => {
        let artist = accounts[0]
        let result, artworkCount
        before(async() => {
            result = await artbox.createArtwork('ArtWork 1', web3.utils.toWei('1', 'Ether'), 'QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN')
            artworkCount = await artbox.artworkCount()
        })

        it('create artworks', async() => {
            //Success
            
            assert.equal(artworkCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), artworkCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'ArtWork 1', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.artist, artist, 'artist is correct') 
            assert.equal(event.owner, artist, 'owner is correct')
            assert.equal(event.purchased, false, 'purchased is correct')
            assert.equal(event.ipfsHash, 'QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN', 'ipfsHash is correct')
            // FAILURE: Product must have a name
            await await artbox.createArtwork('', web3.utils.toWei('1', 'Ether'),'QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN').should.be.rejected;
            // FAILURE: Product must have a price
            await await artbox.createArtwork('ArtWork 1', 0, 'QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN').should.be.rejected;
        })

        it('sells artworks', async() => {
            //Get seller balance
            let ArtistBalance
            const artist = accounts[0]
            const buyer = accounts[2]


            ArtistBalance = await web3.eth.getBalance(artist)
            ArtistBalance = new web3.utils.BN(ArtistBalance)

            //Success: buyer makes purchase
            result = await artbox.buyArtwork(artworkCount,{ from: buyer, value: web3.utils.toWei('1', 'Ether')})

            //
            // checking logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), artworkCount.toNumber(), 'id is correct')
            assert.equal(event.name , 'ArtWork 1', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.artist, artist, "artist is correct")
            assert.equal(event.owner, buyer, 'owner is correct' )
            assert.equal(event.purchased, true, 'purchased is correct')
            assert.equal(event.ipfsHash, 'QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN', 'ipfsHash is correct')

            //check if seller recieved funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(artist)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            const expectedBalance = ArtistBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())


            //Failures
            await artbox.buyArtwork( 99, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected; //if id doesn't exist
            await artbox.buyArtwork(artworkCount, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected //if buyer tries to buy with not enough ether
            await artbox.buyArtwork(artworkCount, {from: artist, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected // Cannot be purchased twice
            await artbox.buyArtwork(artworkCount, {from: artist, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected // buyer cannot be seller

        })
    })
})