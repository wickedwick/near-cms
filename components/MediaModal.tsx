import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { Media } from "../assembly/main"
import { NearContext } from "../context/NearContext"
import MediaCards from "./MediaCards"

const MediaModal = ({ mediaType, setSelectedMedia, onClose, index }: { mediaType: 'image' | 'video' | 'file' | null, setSelectedMedia?: (index: number, media: Media) => void, onClose: Dispatch<SetStateAction<boolean>>, index:number }): JSX.Element => {
  // get all media of type or all media if no type
  const [media, setMedia] = useState<Media[]>([])
  const { contract } = useContext(NearContext)

  useEffect(() => {
    if (!contract) {
      return
    }

    contract.getMedia().then((md: Media[]) => {
      setMedia(md)
    })
  }, [])

  const handleSelection = (media: Media): void => {
    if (setSelectedMedia) {
      setSelectedMedia(index, media)
    }

    onClose(true)
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <button onClick={() => onClose(true)} className="text-gray-light hover:text-gray-light focus:outline-none focus:text-gray-dark transition ease-in-out duration-150">
              ✖
            </button>
            <div className="sm:flex sm:items-start">
              {media.length > 0 &&(
                <MediaCards media={media} handleSelection={handleSelection} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaModal
