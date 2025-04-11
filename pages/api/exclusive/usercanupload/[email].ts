/* eslint-disable @typescript-eslint/no-explicit-any */

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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res)
  const {
    query: { email },
    method,
  } = req

  if (method === 'GET') {
    try {
        const maxPosts = 5
        let postCount = 0
        venueHouseBase('Venue House').select({
            filterByFormula: `{email} = '${email}'`,
        }).firstPage(async function (err: object, records: any) {
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