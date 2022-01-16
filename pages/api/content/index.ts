import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSideContract } from '../../../services/contracts'

type Data = {
  name: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  const contract = await getServerSideContract()
  const content = await contract.getContents()
  
  if (!content) {
    res.status(404).json({ error: "Content type not found" })
    return
  }

  res.status(200).json(content)
}
