import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path/posix";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubcription } from "./_lib/manageSubscription";


async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }
  return Buffer.concat(chunks);
}
//por padrão o next tem o formato de entender as requisições, porém neste caso a requisição está vindo com uma stream, logo essa configuração deve desabilitar o entendimento padrão do next sobre o que está vindona requisição
export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",

]);

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    const buf = await buffer(req)
    const secret = req.headers['stripe-signature'] as string

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET as string)
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err}`)
    }

    const type = event.type;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubcription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;
          case 'checkout.session.completed':

            const checkoutSession = event.data.object as Stripe.Checkout.Session



            await saveSubcription(
              checkoutSession.subscription?.toString() as string,
              checkoutSession.customer?.toString() as string,
              true
            );


            break;
          default:
            throw new Error('Unhandles event.')
        }
      } catch (err) {
        return res.json({ error: 'Webhook handler failed.' })
      }
    }

    res.json({ received: true })
  } else {
    //se não for retorna para o frontend que o metodo aceietado por essa rota é post
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }

}