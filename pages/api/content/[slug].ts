import { NextApiRequest, NextApiResponse } from "next"
import { Content, Field } from "../../../assembly/main"
import { getServerSideContract } from "../../../services/contracts"
import { get } from "../../../services/db"

type Data = {
  name: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query
  const contract = await getServerSideContract()
  const content: Content = await contract.getContent({ slug })
  const savedFields: Field[] = content.fields.map(f => {
    return get(`fields/${content.slug}/${f.name}/fields/${content.slug}/${f.name}`)
  })

  console.log('savedFields', savedFields)

  content.fields = savedFields
  res.status(200).json(content)
}
