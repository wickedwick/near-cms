import { NextApiRequest, NextApiResponse } from "next"
import { Content, ContentType, Field } from "../../../../assembly/main"
import { ContentData } from "../../../../assembly/model"
import { getServerSideContract } from "../../../../services/contracts"
import { db } from "../../../../services/db"

type Data = {
  name: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  const { slug } = req.query
  const contract = await getServerSideContract()
  const content: Content = await contract.getPublicContent({ slug })
  const gunFields = db.get('content').get(`${slug}`).get('fields')
  const savedFields: Field[] = []
  
  await gunFields.map().on((data, id) => {
    const field: Field = {...data, id}
    savedFields.push(field)
  })

  const contentData: ContentData = {
    content,
    name: content.name,
    values: savedFields
  }

  res.status(200).json(contentData)
}
