import axios from "axios"
import { create, IPFS } from "ipfs-core"
import { Dispatch, SetStateAction } from "react"

export const saveToIpfs = async(ipfs: IPFS, file: File): Promise<string> => {
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

export async function instantiateIpfs(setIpfs: Dispatch<SetStateAction<IPFS | null>>): Promise<void> {
  const node: IPFS = await create()
  setIpfs(node)
}

export async function instantiateIpfsServerSide(): Promise<IPFS | null> {
  const node: IPFS = await create()
  return node
}

export const getBase64 = async (cid: string): Promise<string> => {
  const url = `https://ipfs.io/ipfs/${cid}`
  const resp = await axios.get(url, { responseType: "arraybuffer" })
  
  return Buffer.from(resp.data, 'binary').toString('base64')
}
