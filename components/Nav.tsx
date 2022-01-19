import Link from "next/link"
import Router from "next/router"
import { useContext } from "react"
import { Role } from "../assembly/model"
import { NearContext } from "../context/NearContext"

const Nav = (): JSX.Element => {
  const { contract, currentUser, nearConfig, wallet, setCurrentUser } = useContext(NearContext)

  const signIn = () => {
    if (!wallet || !nearConfig || !contract) {
      return
    }

    wallet.requestSignIn(
      {contractId: nearConfig.contractName, methodNames: [contract.setContentType.name]}, //contract requesting access
      'NEAR CMS', //optional name
      undefined, //optional URL to redirect to if the sign in was successful
      undefined //optional URL to redirect to if the sign in was NOT successful
    )
  }

  const signOut = () => {
    if (!wallet) {
      return
    }

    wallet.signOut()
    Router.push('/')
    setCurrentUser(undefined)
  }

  return (
    <nav className="bg-gray">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/">
              <a className="px-3 py-2 m-3 x-4 shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:text-blue text-xl">d CMS</a>
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-end sm:items-stretch">
            {currentUser && currentUser.role <= Role.Editor && (
              <Link href="/content">
                <a className="px-3 py-2 m-3 x-4 shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:bg-blue">Content</a>
              </Link>
            )}
            {currentUser && currentUser.role === Role.Admin && (
              <>
                <Link href="/contentTypes">
                  <a className="px-3 py-2 m-3 x-4 shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:bg-blue">Types</a>
                </Link>

                <Link href="/users/manage">
                  <a className="px-3 py-2 m-3 x-4 shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:bg-blue">Users</a>
                </Link>

                <Link href="/clients/manage">
                  <a className="px-3 py-2 m-3 x-4 shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:bg-blue">Clients</a>
                </Link>
              </>
            )}
            {currentUser
              ? <button className="px-3 py-2 m-3 x-4 border border-blue shadow-sm text-gray-light bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:bg-blue" onClick={signOut}>Logout</button>
              : <button className="px-3 py-2 m-3 x-4 border border-blue shadow-sm text-gray-light bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue hover:bg-blue" onClick={signIn}>Log In</button>
            }
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav