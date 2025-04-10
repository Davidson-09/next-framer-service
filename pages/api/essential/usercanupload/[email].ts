import Cors from 'cors'
import initMiddleware from '@/lib/init-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'
import Airtable from 'airtable'

const cors = initMiddleware(
    Cors({
      methods: ['GET'],
      origin: '*', // Public access
    })
  )

Airtable.configure({ apiKey: process.env.AIRTABLE_KEY, endpointUrl: 'https://api.airtable.com' });
const venueHouseBase = Airtable.base('app0bMO8gPe4LCRL0');
console.log('the key', process.env.AIRTABLE_KEY)

// Sample data
const products = [
  { id: '1', name: 'Phone' },
  { id: '2', name: 'Laptop' },
  { id: '3', name: 'Tablet' },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res)
  const {
    query: { email },
    method,
  } = req

  if (method === 'GET') {
    try {
        const maxPosts = 1
        let postCount = 0
        const resew = await venueHouseBase('Venue House').select({
            filterByFormula: `{email} = '${email}'`,
        }).firstPage(async function (err: any, records: any) {
            if (err) {
                console.log('error here', err)
                throw new Error(JSON.stringify(err))
            }
            console.log('json', JSON.stringify(records?.length, null, 3))
            postCount = records?.length
            return res.status(200).json({ message: 'email checked', canUpload: postCount < maxPosts});
        })
        
    } catch (e){
        return res.status(500).json({ message: JSON.stringify(e, null, 3)});
    }
  } else{
    return res.status(405).json({ message: 'Method not allowed' })
  }
}