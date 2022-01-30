import { AlertProps } from "../types/components"

const Alert = ({ heading, transactionHashes, messages }: AlertProps): JSX.Element => {
  return (
    <div className="border-t-4 border-blue rounded-b text-blue px-4 py-3 shadow-md" role="alert">
      <div className="flex">
        <div className="py-1"><svg className="fill-current h-6 w-6 text-blue mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
        <div>
          <p className="font-bold">{heading}</p>
          {transactionHashes && <p>See the transaction on Near Explorer <a className="underline" href={`https://explorer.testnet.near.org/transactions/${transactionHashes}`} target="_blank">here</a></p>}
          {messages && messages.length && (
            <ul>
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Alert
