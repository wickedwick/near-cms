import type { NextApiRequest, NextApiResponse } from 'next'
import { Content } from '../../../assembly/main'
import { getServerSideContract } from '../../../services/contracts'
import { CmsContract } from '../../../types/contract'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Content[] | { error: string }>
) => {
  const contract = await getServerSideContract() as CmsContract
  let content: Content[] = await contract.getContents()
  
  if (!content) {
    res.status(404).json({ error: "Content type not found" })
    return
  }

  const { type } = req.query
  
  if (type) {
    content = content.filter(c => c.type.name.toLowerCase() === type)
  }

  res.status(200).json(content)
}
