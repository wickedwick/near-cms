import { useContext, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { Media } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import MediaCards from '../../components/MediaCards'
import { NearContext } from '../../context/NearContext'
import Alert from '../../components/Alert'

const MediaIndex: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [message, setMessage] = useState<string>('')
  const [media, setMedia] = useState<Media[]>([])
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState<string>('')
  
  useEffect(() => {
    init()
  }, [])

  const init = async (): Promise<void> => {
    setTransactionHashes(Router.query.transactionHashes as string)
    setMessage(Router.query.message as string)
    
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    setContractedLoaded(true)
    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const m = await contract.getMedia()
    setMedia(m)
  }

  return (
    <Layout home={false}>
      <h1 className="title">Media</h1>
      <p className="text-blue text-center text-xl mb-5">Upload and manage files, images, and videos.</p>

      {(!contract || !currentUser) && <div>Loading...</div>}

      {transactionHashes && (
        <Alert heading="Success!" transactionHashes={transactionHashes} />
      )}

      {message && (
        <Alert heading="Success!" messages={[message]} />
      )}

      {contract && currentUser && !contractLoaded && !media.length && <LoadButton initFunction={init} />}
      
      {contract && contractLoaded && !media.length && (
        <div>No media found</div>
      )}

      <div className="my-6">
        <Link href="/media/new">
          <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Upload</a>
        </Link>
        <p className="pl-5 inline text-blue">Let&apos;s upload a file!</p>
      </div>

      {contract && contractLoaded && media.length > 0 &&(
        <MediaCards media={media} />
      )}
    </Layout>
  )
}

export default MediaIndex
