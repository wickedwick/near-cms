import { useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { Content } from '../../assembly/main'
import { NearContext } from "../../context/NearContext";
import { Role } from "../../assembly/model";
import Layout from "../../components/Layout";

const Contents: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [content, setContent] = useState<Content[]>([])
  
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

    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    contract.getContents().then((ct: Content[]) => {
      setContent(ct)
    })
  }

  const deleteContent = (ct: Content): void => {
    if (!contract) {
      return
    }

    contract.deleteContent({ content: ct }).then(() => {
      init()
    })
  }

  const editContent = (ct: Content): void => {
    if (!contract) {
      return
    }

    Router.push('/content/[slug]', `/content/${ct.slug}`)
  }

  return (
    <Layout home={false}>
      <h1 className="title">Content</h1>
      {!contract && <div>Loading...</div>}
      {contract && !content.length && <button onClick={init}>Load</button>}
      <div className="my-3">
        <Link href="/content/new">
          <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Create New</a>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Name</th>
            <th>Content Type</th>
            <th>Public</th>
          </tr>
        </thead>
        <tbody>
        {contract && content && content.map((ct) => {
          return (
            <tr key={ct.name}>
              <td>
                <button className="px-3 py-2 my-3 mr-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => editContent(ct)}>Edit</button>
                <button className="px-3 py-2 my-3 x-4 border border-blue bg-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => deleteContent(ct)}>Delete</button>
              </td>
              <td>{ct.name}</td>
              <td>{ct.type.name}</td>
              <td>{ct.isPublic ? 'Yes' : 'No'}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </Layout>
  )
}

export default Contents
