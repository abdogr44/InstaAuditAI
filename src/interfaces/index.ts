export type { User } from './User'


export interface Profile {
  id?: string
  first_name?: string
  last_name?: string
  email: string
  picture?: string
  name?: string
  is_subscribed: boolean
  plan_id?: string
  stripe_customer_id?: string
  last_plan_update?: string
}
