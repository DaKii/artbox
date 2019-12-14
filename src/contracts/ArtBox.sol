pragma solidity ^0.5.0;

contract ArtBox {
    string public contractName;
    uint public artworkCount = 0;
    mapping(uint => Artwork) public artworks;
    uint[] public artworkID;

    //Not yet implemented, to "remove" an item from blockchain
    enum ArtWorkStatus {
        active,
        sold,
        removed
    }

    //Structs
    struct Artwork {
        uint id;
        string name;
        uint price;
        address payable artist;
        address payable owner;
        string ipfsHash;
        bool purchased;
    }

     //Emitting Events for testing
    event ArtworkEvent(
        uint id,
        string name,
        uint price,
        address payable artist,
        address payable owner,
        string ipfsHash,
        bool purchased
    );


    //Constructors
    constructor() public{
        contractName = "ArtBox";
    }

    //Functions
    function createArtwork(string memory _name, uint _price, string memory _ipfsHash) public {
        //Require valid parameters
        require(bytes(_name).length > 0, "Name is not valid");
        require(_price > 0, "Price is not valid");
        artworkCount++;

        // Create artwork
        artworks[artworkCount] = Artwork(artworkCount, _name, _price, msg.sender, msg.sender, _ipfsHash, false);
        artworkID.push(artworkCount)-1;

        //Event for test
        emit ArtworkEvent(artworkCount, _name, _price, msg.sender, msg.sender,  _ipfsHash,false);
    }

    function buyArtwork(uint _id) public payable {

        Artwork memory _artwork = artworks[_id];
        address payable _seller = _artwork.owner;
        //validation
        require(_artwork.id > 0 && _artwork.id <= artworkCount, "ID is not valid");
        require(msg.value >= _artwork.price, "Value is not");
        require(!_artwork.purchased, "artwork not available");
        require(_seller != msg.sender, "seller can not be buyer");

        //update values
        _artwork.owner = msg.sender;
        _artwork.purchased = true;
        artworks[_id] = _artwork;
        address(_seller).transfer(msg.value);

        //Event for testing
        emit ArtworkEvent(artworkCount, _artwork.name, _artwork.price, _artwork.artist, msg.sender, _artwork.ipfsHash, true);


    }

    function getArtworks() public view returns(uint[] memory){
        return artworkID;
    }

    function getArtwork(uint _id) public view  returns (uint, string memory , uint, address payable, address payable, string memory, bool) {

        return (
            artworks[_id].id,
            artworks[_id].name,
            artworks[_id].price,
            artworks[_id].artist,
            artworks[_id].owner,
            artworks[_id].ipfsHash,
            artworks[_id].purchased
        );
    }

}
