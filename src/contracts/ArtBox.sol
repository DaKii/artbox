pragma solidity ^0.5.0;


contract ArtBox {
    //Intialization of variables
    string public contractName;
    uint public artworkCount = 0;
    uint[] public artworkID;
    mapping(address => uint) public createdCount; //amount of artwork created by an address
    mapping(address => uint) public ownerCount; //amount of artwork owned by owner
    mapping(uint => Artwork) public artworks; //amount of artworks
    mapping(address => mapping(uint => Artwork)) public ownersCollection; //mapped artwork ID to a user's address
    mapping(address => mapping(uint => Artwork)) public userCreated; // mapped artwork to a user's address

    //TODO: status for artwork
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
        string originalHash;
        string waterMarkedHash;
    }


     //Emitting Events for testing
    event sellArtworkEvent(
        uint id,
        string name,
        uint price,
        address payable artist,
        address payable owner,
        string originalHash,
        string waterMarkedHash
    );

    event buyArtworkEvent(
        uint id,
        string name,
        uint price,
        address payable artist,
        address payable owner,
        string originalHash
    );



    //Constructors
    constructor() public{
        contractName = "ArtBox";
    }

    //Functions
    function createArtwork(string memory _name, uint _price, string memory _originalHash, string memory _waterMarkedHash) public {

        //Require valid parameters
        require(bytes(_name).length > 0, "Name is not valid");
        require(_price > 0, "Price is not valid");
        artworkCount++;

        // Create artwork
        artworks[artworkCount] = Artwork(artworkCount, _name, _price, msg.sender, msg.sender,  _originalHash, _waterMarkedHash);
        artworkID.push(artworkCount)-1;

        //Increasing a user's createdCount and ownedCount
        ownerCount[msg.sender]++;
        createdCount[msg.sender]++;


        //adding artwork to owner list and crated list
        ownersCollection[msg.sender][artworkCount] = artworks[artworkCount];
        userCreated[msg.sender][createdCount[msg.sender]] = artworks[artworkCount];

        //Event for test
        emit sellArtworkEvent(artworkCount, _name, _price, msg.sender, msg.sender, _originalHash, _waterMarkedHash);
    }

    function buyArtwork(uint _id) public payable {

        Artwork memory _artwork = artworks[_id];
        address payable _seller = _artwork.owner;

        //validation
        require(_artwork.id > 0 && _artwork.id <= artworkCount, "ID is not valid");
        require(msg.value >= _artwork.price, "Bid is too low");
        require(_seller != msg.sender, "seller can not be buyer");

        //update values
        _artwork.owner = msg.sender;
        artworks[_id] = _artwork;

        //add artwork to new owner's collection
        ownersCollection[msg.sender][_id] = artworks[_id];
        ownerCount[msg.sender]++;

        //delete from previous owner's collection
        delete ownersCollection[_seller][_id];
        ownerCount[_seller]--;

        address(_seller).transfer(msg.value);

        //Event for testing
        emit buyArtworkEvent(artworkCount, _artwork.name, _artwork.price, _artwork.artist, msg.sender, _artwork.waterMarkedHash);


    }

    function getArtworks() public view returns(uint[] memory){
        return artworkID;
    }

    function getArtwork(uint _id) public view  returns (string memory , uint, address payable, address payable, string memory) {
        return (
            artworks[_id].name,
            artworks[_id].price,
            artworks[_id].artist,
            artworks[_id].owner,
            artworks[_id].waterMarkedHash
        );
    }
}
