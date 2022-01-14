import { NextApiRequest, NextApiResponse } from "next"
import { Content, ContentType, Field } from "../../../assembly/main"
import { ContentData } from "../../../assembly/model"
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
  const contentType: ContentType = await contract.getContentType({ name: content.type.name })
  
  if (!contentType) {
    res.status(404).json({ error: "Content type not found" })
    return
  }

  const savedFields: Field[] = contentType.fields.map(f => {
    return get(`fields/${content.slug}/${f.name}/fields/${content.slug}/${f.name}`)
  })

  const contentData: ContentData = {
    name: content.name,
    content,
    values: savedFields
  }
  res.status(200).json(contentData)
}
