import * as nearAPI from 'near-api-js'
import getConfig from '../config'

export const getServerSideContract = async () => {
  const KEY_PATH = "../../neardev/shared-test/test.near.json"
  const nearConfig = getConfig('testnet')
  const config = {
    networkId: nearConfig.networkId,
    headers: nearConfig.headers,
    nodeUrl: nearConfig.nodeUrl,
    deps: {
      keyStore: new nearAPI.keyStores.UnencryptedFileSystemKeyStore(KEY_PATH),
    },
  }

  const near = await nearAPI.connect(config)
  const account = await near.account('wickham.testnet')
  const contract = await new nearAPI.Contract(
    account,
    nearConfig.contractName,
    {
      viewMethods: ['getContentType', 'getContentTypes', 'getContents', 'getContent', 'getUserRole'],
      changeMethods: ['setContentType', 'deleteContentType', 'setContent', 'deleteContent', 'setUserRole', 'deleteUserRole'],
      sender: account.accountId,
    }
  )

  return contract
}