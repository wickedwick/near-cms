import Gun from 'gun'
import 'gun/axe'
import 'gun/sea'

export const db = Gun('https://tranquil-thicket-13876.herokuapp.com/gun')

export const user = db.user().recall({sessionStorage: true})

export const get = (key: string) => {
  let ret: any = {}
  db.get(key).on(data => {
    ret = data
  })
  return ret
}

export const post = (key: string, value: any) => {
  return db.get(key).put(value)
}

export const put = (key: string, value: any) => {
  let ret: any = {}
  
  db.get(key).put({ [key]: value }, (soul) => {
    ret = soul
  })

  return ret
}

export const del = (key: string) => {
  return db.get(key).put(null)
}

export const getSet = (setName: string) => {
  let ret: any[] = []
  db.get(setName).map().once(data => {
    ret.push(data)
  })

  return ret
}

export const putSet = (setName: string, key: string, value: any) => {
  let ret: any = {}
  
  const field = db.get(key).put({ [key]: value }, (soul) => {
    ret = soul
  })
  
  db.get(setName).set(field)

  return ret
}
