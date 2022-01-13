// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSideContract } from '../../services/contracts'
import { get } from '../../services/db'

type Data = {
  name: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const contract = await getServerSideContract()
  const content = await contract.getContents()
  res.status(200).json(content)
}
