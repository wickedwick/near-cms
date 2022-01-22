const LoadButton = ({ initFunction }: { initFunction: () => void }) => {
  return (
    <div className="my-3">
      <button className="px-3 text-lg py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={initFunction}>Load</button>
      <small className="block text-gray-light">Smart contracts have loaded, click to load data</small>
    </div>
  )
}

export default LoadButton
