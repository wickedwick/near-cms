import { NextApiRequest, NextApiResponse } from "next"
import { getServerSideContract } from "../../../services/contracts"

type Data = {
  name: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query
  const contract = await getServerSideContract()
  const content = await contract.getContent({ slug })
  res.status(200).json(content)
}
