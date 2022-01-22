import * as nearAPI from 'near-api-js'
import { User } from '../assembly/main'
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
  const contract = new nearAPI.Contract(
    account,
    nearConfig.contractName,
    {
      viewMethods: ['getContentType', 'getContentTypes', 'getContents', 'getContent', 'getUserRole', 'getUser', 'getUsers', 'getClients', 'getClient', 'getPublicContent', 'getPublicContents', 'getMedia', 'getMediaBySlug'],
      changeMethods: ['setContentType', 'deleteContentType', 'setContent', 'deleteContent', 'setUserRole', 'deleteUserRole', 'setUser', 'setClient', 'deleteClient', 'setMedia', 'deleteMedia'],
      sender: account.accountId,
    }
  )

  return contract
}

export const initContract = async () => {
  const nearConfig = getConfig('testnet')
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
  const near = await nearAPI.connect({ keyStore, ...nearConfig })
  const walletConnection = new nearAPI.WalletConnection(near, '')
  let currentUser

  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    } as User
  }

  const contract = new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ['getContentType', 'getContentTypes', 'getContents', 'getContent', 'getUserRole', 'getUser', 'getUsers', 'getClients', 'getClient', 'getPublicContent', 'getPublicContents', 'getMedia', 'getMediaBySlug'],
      changeMethods: ['setContentType', 'deleteContentType', 'setContent', 'deleteContent', 'setUserRole', 'deleteUserRole', 'setUser', 'setClient', 'deleteClient', 'setMedia', 'deleteMedia'],
      sender: walletConnection.getAccountId(),
    }
  )

  return { contract, currentUser, nearConfig, walletConnection }
}
