
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const bioBanks = await prisma.bioBank.findMany()
  
  return res.status(200).json(bioBanks)
}