import 'regenerator-runtime/runtime';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import App from '../App';
import { NetworkConfiguration } from '../../types/configuration';
import { User } from '../../types/app';
const { act } = TestRenderer;

const contract: any = {
  account: {
    connection: {},
    accountId: 'test.near'
  },
  contractId: 'test.near',
  getMessages: () => new Promise(() => {}),
  addMessage: () => ''
};

const walletConnection: any = {
  account: () => ({ _state: { amount: '1' + '0'.repeat(25) } }),
  requestSignIn: () => null,
  signOut: () => null,
  isSignedIn: () => false,
  getAccountId: () => 'test.near'
};

const nearConfig: NetworkConfiguration = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  contractName: 'test.near',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://near-contract-helper.onrender.com'
};

const user: User = {
  accountId: 'test.near',
  balance: '1' + '0'.repeat(25)
}

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('renders with proper title', () => {
  let testRenderer;

  act(() => {
    testRenderer = TestRenderer.create(
      <App contract={contract} wallet={walletConnection} nearConfig={nearConfig} currentUser={user} />
    );
  });

  const testInstance = testRenderer.root;

  expect(testInstance.findByType('h1').children).toEqual(['NEAR Guest Book']);
});
