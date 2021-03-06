import { SEA } from "gun"
import { NextApiRequest, NextApiResponse } from "next"
import { Content, Field } from "../../../assembly/main"
import { ContentData } from "../../../assembly/model"
import { getServerSideContract } from "../../../services/contracts"
import { db } from "../../../services/db"
import { CmsContract } from "../../../types/contract"

type Data = {
  name: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  const fileTypes = ['image', 'video', 'file']
  const { slug } = req.query
  const contract = await getServerSideContract() as CmsContract
  const content: Content = await contract.getContent({ slug })
  const gunFields = db.get('content').get(`${slug}`).get('fields')
  let savedFields: Field[] = []
  
  await gunFields.map().on(async (data, id) => {
    const field: Field = {...data, id}
    
    if (fileTypes.includes(field.fieldType.toLowerCase())) {
      const slug = field.value
      const media = await contract.getMediaBySlug({ slug })
      field.value = media
    }

    if (content.isEncrypted) {
      // TODO: Move to server side
      field.value = await SEA.decrypt(field.value, 'xgzSmRn5XJcJJefH') as string
    }

    savedFields.push(field)
  })
  
  savedFields = savedFields.filter((f, index) => {
    const firstField = savedFields.find((f2) => f.name === f2.name && f.value === f.value) as Field
    return savedFields.indexOf(firstField) === index
  })

  const contentData: ContentData = {
    content,
    name: content.name,
    values: savedFields
  }

  res.status(200).json(contentData)
}
