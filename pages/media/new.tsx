import { useContext, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { nanoid } from 'nanoid'
import { Media } from '../../assembly/main'
import { MediaType, Role } from '../../assembly/model'
import Alert from '../../components/Alert'
import Layout from '../../components/Layout'
import { NearContext } from '../../context/NearContext'
import { IpfsContext } from '../../context/IpfsContext'
import LoadButton from '../../components/LoadButton'
import { validateMedia } from '../../validators/media'
import LoadingIndicator from '../../components/LoadingIndicator'

const NewMedia: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const { ipfs, saveToIpfs } = useContext(IpfsContext)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Image)
  const [filename, setFilename] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init()
  }, [])

  const init = (): void => {
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    setContractedLoaded(true)
    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }
  }

  const handleSetFile = async (file: File): Promise<void> => {
    setFilename(file.name)
    setFile(file)
    switch(file.type) {
      case 'image/jpeg':
      case 'image/png':
        setMediaType(MediaType.Image)
        break
      case 'video/mp4':
        setMediaType(MediaType.Video)
        break
      default:
        setMediaType(MediaType.File)
        break
    }
  }
  
  const handleSubmit = async (): Promise<void> => {
    setLoading(true)
    setDescription('')
    
    if (!name) {
      setDescription('Name is required')
      setLoading(false)
      return
    }
    
    if (!file) {
      setDescription('File is required')
      setLoading(false)
      return
    }
    
    if (!contract) {
      setDescription('Contract is not available')
      setLoading(false)
      return
    }
    
    const cid = await saveToIpfs(ipfs, file)
    if (!cid) {
      setDescription('Failed to save to IPFS')
      setLoading(false)
      return
    }
    
    const media: Media = {
      name,
      url,
      mediaType,
      filename,
      slug: nanoid(),
      cid,
      uploadedAt: new Date().toISOString(),
    }
    
    const validationResult = validateMedia(media)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      setLoading(false)
      return
    }

    await contract.setMedia({
      args: { media }, 
      callbackUrl: `${process.env.baseUrl}/media`,
    })

    Router.push('/media')
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Add Media</h1>
      {(!contract || !currentUser) && <div>Loading...</div>}

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}
      
      {file && (
        <div>
          <p>{file.name} | {file.type} | {file.size} bytes</p>
        </div>
      )}
      
      {description && <p>{description}</p>}

      {contract && loading && (
        <LoadingIndicator />
      )}
      
      {contract && contractLoaded && (
        <>
          <label htmlFor="name">Name</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="name">URL (optional)</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />

          <label htmlFor="file">File</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="file" onChange={(e) => handleSetFile(e.target.files[0])} />

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
