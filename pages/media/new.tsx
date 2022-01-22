import { useContext, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { nanoid } from 'nanoid'
import { Media } from '../../assembly/main'
import { MediaType, Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import { NearContext } from '../../context/NearContext'
import { IpfsContext } from '../../context/IpfsContext'

const NewMedia: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const { ipfs, saveToIpfs } = useContext(IpfsContext)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Image)
  const [filename, setFilename] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
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
  }

  const handleSubmit = async (): Promise<void> => {
    if (!contract) {
      return
    }

    const cid = await saveToIpfs(ipfs, file)

    const media: Media = {
      name,
      url,
      mediaType,
      filename,
      slug: nanoid(),
      cid,
      uploadedAt: new Date().toISOString(),
    }

    contract.setMedia(media).then(() => {
      Router.push('/media')
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title">Add Media</h1>
      {!contract && <div>Loading...</div>}
      {file && (
        <div>
          <p>{file.name}</p>
          <p>{file.type}</p>
          <p>{file.size}</p>
        </div>
      )}
      {contract && (
        <>
          <label htmlFor="name">Name</label>
          <input className="block px-3 py-2 mb-3 w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="name">URL</label>
          <input className="block px-3 py-2 mb-3 w-full" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      
          <label htmlFor="name">Media Type</label>
          <select className="block px-3 py-2 mb-3 w-full" value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
            <option value={MediaType.Image}>Image</option>
            <option value={MediaType.Video}>Video</option>
            <option value={MediaType.File}>File</option>
          </select>

          <label htmlFor="file">File</label>
          <input className="block px-3 py-2 mb-3 w-full" type="file" onChange={(e) => setFile(e.target.files[0])} />

          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Create</button>
          <Link href="/media">
            <a className="">Back</a>
          </Link>
        </>
      )}
    </Layout>
  )
}

export default NewMedia
