import _ from 'lodash'
import { BaseError } from '../@types/errors'

export interface CustomMessages {
  (messages: BaseError[], v: BaseError): { message?: string } | undefined
}

const customMessages: CustomMessages = (messages = [], v) => {
  return _.first(
    messages.filter((m) => {
      if (m.field === v.field) {
        return m.code === v.code
      }
      if (m.resourceKey === v.resourceKey) {
        return m.code === v.code
      }
      return m.code === v.code
    })
  )
}

export default customMessages
