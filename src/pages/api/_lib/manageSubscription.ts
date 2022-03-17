//função que slava informações no banco de dados
import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna"
import { stripe } from '../../../services/stripe'

export async function saveSubcription(subscriptionId: string, customerId: string, createAction = false) {
  //buscar o usuário no banco do FaunaDB com o ID do {customerId}
  //Salvaar os dados da  subscription no FaunaDB

  console.log(subscriptionId, customerId)

  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscriptionId,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,

  }

  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      //replace atualiza todos os campos e o update permite atualizar apenas alguns campos
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscription_by_id"),
              subscriptionId,
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }


}