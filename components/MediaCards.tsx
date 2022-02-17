import Link from "next/link"
import { Media } from "../assembly/main"
import { MediaType } from "../assembly/model"

const MediaCards = ({ media, handleSelection }: { media: Media[], handleSelection?: (media: Media) => void }): JSX.Element => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {media.map((m: Media) => (
        <div key={m.slug} className="flex flex-col">
          {m.mediaType === MediaType.Image && (
            <img src={`https://ipfs.io/ipfs/${m.cid}`} alt={m.name} className="w-full object-cover" /> 
          )}
          <p>{m.name}</p>
          <p>{m.filename}</p>
          {handleSelection && (
            <button className="block px-3 py-2 my-3 bg-blue text-gray-light hover:text-gray-light focus:outline-none focus:text-gray-dark transition ease-in-out duration-150" onClick={() => handleSelection(m)}>Select</button>
          )}
          <Link href={`/media/${m.slug}`}>
            <a className="block px-3 py-2 my-3 bg-blue text-gray-light hover:text-gray-light focus:outline-none focus:text-gray-dark transition ease-in-out duration-150">Edit</a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default MediaCards
