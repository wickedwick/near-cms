import { nanoid } from 'nanoid'
import { NextPage } from 'next'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Media } from '../../assembly/main'
import { MediaType, Role } from '../../assembly/model'
import Alert from '../../components/Alert'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { IpfsContext } from '../../context/IpfsContext'
import { NearContext } from '../../context/NearContext'
import { validateMedia } from '../../validators/media'

const EditMedia: NextPage = () => {
  const { ipfs, saveToIpfs, removeFromIpfs } = useContext(IpfsContext)
  const { contract, currentUser } = useContext(NearContext)
  const [media, setMedia] = useState<Media | null>(null)
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Image)
  const [filename, setFilename] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [cid, setCid] = useState('')

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    init()
  }, [])

  const init = async (): Promise<void> => {
    if (!contract) {
      return
    }

    setContractedLoaded(true)
    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const mediaData: Media = await contract.getMediaBySlug({ slug })

    setMedia(mediaData)
    setName(mediaData.name)
    setUrl(mediaData.url)
    setMediaType(mediaData.mediaType)
    setFilename(mediaData.filename)
    setCid(mediaData.cid)
  }

  const handleSetFile = async (file: File): Promise<void> => {
    setFilename(file.name)
    setFile(file)
    console.log('file type', file.type)
    switch(file.type) {
      case 'image/jpeg':
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

  const handleDeleteFile = async (): Promise<void> => {
    if (!contract) {
      return
    }

    const removed = await removeFromIpfs(ipfs, cid)
    await contract.deleteMedia({
      args: { slug }, 
      callbackUrl: `${process.env.baseUrl}/media?message=Media deleted`,
    })

    Router.push('/media?message=Media deleted')
  }

  const handleSubmit = async (): Promise<void> => {
    setDescription('')

    if (!name) {
      setDescription('Name is required')
      return
    }

    if (!file) {
      setDescription('File is required')
      return
    }

    if (!contract) {
      setDescription('Contract is not available')
      return
    }

    await removeFromIpfs(ipfs, cid);
    const newCid = await saveToIpfs(ipfs, file)
    if (!newCid) {
      setDescription('Failed to save to IPFS')
      return
    }

    const media: Media = {
      name,
      url,
      mediaType,
      filename,
      slug: nanoid(),
      cid: newCid,
      uploadedAt: new Date().toISOString(),
    }

    const validationResult = validateMedia(media)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
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
      {media?.name ? (
        <h1 className="title mb-5">Edit {media.filename}</h1>
      ) : (
        <h1 className="title mb-5">Media</h1>
      )}

      {(!contract || !currentUser) && <div>Loading...</div>}

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}
      
      {description && <p>{description}</p>}
      
      {contract && contractLoaded && media && media.mediaType === MediaType.Image && (
        <img src={`https://ipfs.io/ipfs/${media.cid}`} alt={media.name} />
      )}

      {contract && contractLoaded && media && (
        <div className="">
          <p>URL https://ipfs.io/ipfs/{media.cid}</p>

          <label htmlFor="name">Name</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="name">URL (optional)</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />

          <label htmlFor="file">File</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="file" onChange={(e) => handleSetFile(e.target.files[0])} />

          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Update</button>
        </div>
      )}
      
      <button className="px-3 py-2 my-3 mr-3 x-4 border border-yellow shadow-sm text-gray-dark bg-yellow hover:bg-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow" onClick={handleDeleteFile}>Delete</button>
      <Link href="/media">
        <a className="">Back</a>
      </Link>
    </Layout>
  )
}

export default EditMedia