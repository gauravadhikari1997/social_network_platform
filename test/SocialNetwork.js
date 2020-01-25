const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai').use(require('chai-as-promised')).should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
  let socialNetwork
  before( async () => {
    socialNetwork = await SocialNetwork.deployed()
  })
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = socialNetwork.address
      assert.notEqual(address, 0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })
    describe('posts', async () => {
      it('creates posts', async () => {
        let result = await socialNetwork.createPost('First post', {from: author})
        let postCount = await socialNetwork.postCount()
        assert.equal(postCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
        assert.equal(event.content, 'First post', 'content is correct')
        assert.equal(event.tipAmount, '0', 'tipAmount is correct')
        assert.equal(event.address, author, 'author is correct')

      })
      // it('lists posts', async () => {
      //
      // })
      // it('allows users to tip posts', async () => {
      //
      // })
    })

})
