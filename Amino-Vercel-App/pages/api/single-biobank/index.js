import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  // this route is unused perhaps we can make use of it when a donor clicks the bioBank they want to go to
  const bioBank = await prisma.bioBank.findUnique({
    where: {
      id: req.body.bioBankId
    },
  })  
  return res.status(200).json(bioBank)
}