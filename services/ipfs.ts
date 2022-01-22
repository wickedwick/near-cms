import { create, IPFSHTTPClient } from "ipfs-http-client"
import { Dispatch, SetStateAction } from "react"

export const saveToIpfs = async(ipfs: IPFSHTTPClient, file: File): Promise<string> => {
  if (!ipfs) {
    return ''
  }

  try {
    const added = await ipfs.add(file)
    return added.cid.toString()
  }
  catch (err) {
    return ''
  }
}

export async function instantiateIpfs(setIpfs: Dispatch<SetStateAction<IPFSHTTPClient | null>>): Promise<void> {
  const multiaddr: string = '/ip4/127.0.0.1/tcp/5001'

  const http = create(multiaddr)
  const isOnline = await http.isOnline()
  
  if (isOnline) {
    setIpfs(http)
  }
}