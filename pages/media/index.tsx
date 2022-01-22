import { useContext, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { Media } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { NearContext } from '../../context/NearContext'

const MediaIndex: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    if (!contract) {
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

    contract.getMedia().then((m: Media[]) => {
      setMedia(m)
    })

    setLoading(false)
  }

  return (
    <Layout home={false}>
      <h1 className="title">Media</h1>
      {!contract && <div>Loading...</div>}
      {contract && loading && !media.length && <LoadButton initFunction={init} />}
      <div className="my-3">
        <Link href="/media/new">
          <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Upload</a>
        </Link>
      </div>
      {contract && media.length > 0 &&(
        <div className="grid grid-cols-4 gap-4">
          {media.map((m: Media) => (
            <div key={m.slug} className="flex flex-col">
              <p>{m.name}</p>
              <p>{m.mediaType}</p>
              <p>{m.filename}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default MediaIndex
