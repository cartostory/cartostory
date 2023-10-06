import { db } from './client'
import { create } from './stories/create'
import { remove } from './stories/delete'
import { getUserId } from './stories/utils'
import { readOne, readAll } from './stories/read'
import { update } from './stories/update'

export const story = {
  create: create(db),
  delete: remove(db),
  getUserId: getUserId(db),
  readOne: readOne(db),
  readAll: readAll(db),
  update: update(db),
}
