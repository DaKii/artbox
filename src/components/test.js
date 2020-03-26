
          <div class="container-fluid">
          <NavLink to="/gallery/upload"><Button className='upload'>Upload</Button></NavLink>
          <div class="row ">
            { this.props.artworks.map((artwork, key) => {
              return(

                <div class="col col-sm one">
                  <div class="box" key={key}>
                    <h3>{artwork.name}</h3>
                    { !artwork.waterMarkedHash
                      ? <h2>It is empty</h2>
                      : /*<NavLink to={{
                          pathname:'/gallery/image/',
                          aboutProps:{
                            artwork_id: artwork.id,
                            artwork_name: artwork.name,
                            artwork_waterMarkedHash: artwork.waterMarkedHash,
                            artwork_originalHash: artwork.originalHash,
                            price: artwork.price ,
                            owner: artwork.owner,
                            artist: artwork.artist, 
                          } }}><img src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" width="350px" height="350px"></img></NavLink> */
                          <a className='image' onClick={this.handleOpenModal}>
                            <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" width="350px" height="350px"></img>
                          </a>
                    }
                    <div>
                    </div>
                  </div>
                </div>

              )
            })}
          </div>
        </div>


<div class="box" key={key}>
<div>{artwork.name}</div>
{ !artwork.waterMarkedHash
  ? <h2>It is empty</h2>
  : <NavLink to={{
      pathname:'/image',
      aboutProps:{
        artwork_id: artwork.id,
        artwork_name: artwork.name,
        artwork_waterMarkedHash: artwork.waterMarkedHash,
        artwork_originalHash: artwork.originalHash,
        price: artwork.price ,
        owner: artwork.owner,
        artist: artwork.artist,
      } }}><img src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" width="100px" height="100px"></img></NavLink>
}
<div>Price: {window.web3.utils.fromWei(artwork.price.toString(), 'Ether')} Eth</div>
<div>Owner: {artwork.owner}</div>
<div>Artist: {artwork.artist}</div>
<div>
  { artwork.owner !== this.props.account
      ? <button
          id="buy"
          name={artwork.id}
          data-hash={artwork.originalHash}
          value={artwork.price}
          onClick={this.handleChange.bind(this)}
      >
          Buy
      </button>
      : <button
          id='download'
          name={artwork.id}
          data-hash={artwork.originalHash}
          value={artwork.price}
          onClick={this.handleChange.bind(this)}
          >
            Download
          </button>
  }
</div>