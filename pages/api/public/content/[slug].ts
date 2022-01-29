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
  const fileTypes = ['image', 'video', 'file']
  const { slug } = req.query
  const contract = await getServerSideContract()
  const content: Content = await contract.getPublicContent({ slug })
  const gunFields = db.get('content').get(`${slug}`).get('fields')
  let savedFields: Field[] = []
  
  await gunFields.map().on(async (data, id) => {
    const field: Field = {...data, id}

    if (fileTypes.includes(field.fieldType.toLowerCase())) {
      const slug = field.value
      const media = await contract.getMediaBySlug({ slug })
      field.value = media
    }

    savedFields.push(field)
  })

  savedFields = savedFields.filter((f, index) => {
    return savedFields.indexOf(f) === index
  })

  if (!content) {
    res.status(404).json({ error: 'Content not found' })
    return
  }

  const contentData: ContentData = {
    content,
    name: content.name,
    values: savedFields
  }

  res.status(200).json(contentData)
}
