import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ContentType } from '../../assembly/main'
import { NearContext } from '../../context/NearContext'
import Router from 'next/router'
import { Role } from '../../assembly/model'

const ContentTypes: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

  useEffect(() => {
    if (!contract) {
      setTimeout(() => {
        init
      }
      , 5000)

      return
    }

    init()
  }, [])
  
  const init = (): void => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    contract.getContentTypes().then((ct: ContentType[]) => {
      setContentTypes(ct)
    })
  }

  const deleteContentType = (ct: ContentType): void => {
    if (!contract) {
      return
    }

    contract.deleteContentType({ name: ct.name }).then(() => {
      init()
    })
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Content Types</h1>
        {!contract && <div>Loading...</div>}
        {contract && !contentTypes.length && <button onClick={init}>Load</button>}
        <table>
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
              {contract && contentTypes && contentTypes.map((ct) => {
                return (
                  <tr key={ct.name}>
                    <td><button onClick={() => deleteContentType(ct)}>Delete</button></td>
                    <td>{ct.name}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
        <Link href="/contentTypes/new">
          <a>New</a>
        </Link>
      </main>
    </div>
  )
}

export default ContentTypes
