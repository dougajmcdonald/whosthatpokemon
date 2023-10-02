// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import typeJson from '../../../types.json'

export default function handler(req, res) {
  res.status(200).json(typeJson)
}
