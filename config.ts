import { NetworkConfiguration } from "../types/configuration";

export const CONTRACT_NAME = process.env.CONTRACT_NAME || 'wickham.testnet'; // 'dev-1641709731586-99971157649148';

export function getConfig(env: string): NetworkConfiguration {
  switch(env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      };
    case 'testnet':
    case 'development':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      };
      case 'betanet':
        return {
          networkId: 'betanet',
          nodeUrl: 'https://rpc.betanet.near.org',
          contractName: CONTRACT_NAME,
          walletUrl: 'https://wallet.betanet.near.org',
          helperUrl: 'https://helper.betanet.near.org'
        };
    case 'local':
      return {
        networkId: 'localnet',
        nodeUrl: 'http://127.0.0.1:52421',
        keyPath: `${process.env.HOME}/.neartosis/2022-01-09T00.04.45/validator-key.json`,
        walletUrl: 'http://127.0.0.1:52493',
        contractName: CONTRACT_NAME
      };
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near'
      };
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near'
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
  }
}
