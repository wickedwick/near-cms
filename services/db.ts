import Gun from 'gun'
import 'gun/sea'
import 'gun/axe'

export const db = Gun('contentStore')

export const user = db.user().recall({sessionStorage: true})

export const get = (key: string) => {
  console.log('get', key)
  let ret: any = {}
  db.get(key).on(data => {
    console.log('get', data)
    ret = data
  })

  return ret
}

export const post = (key: string, value: any) => {
  return db.get(key).put(value)
}

export const put = (key: string, value: any) => {
  return db.get(key).put({ [key]: value }, (soul) => {
    soul = soul
  })
}

export const del = (key: string) => {
  return db.get(key).put(null)
}
