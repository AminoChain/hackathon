import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  req.body.location = req.body.state

  const bioBank = await prisma.bioBank.create({
    data: {
      name: req.body.name,
      location: req.body.location,
      shippingInfo: {
        create: {
          street: req.body.street,
          apartmentNum: req.body.apartmentNum,
          state: req.body.state,
          zipcode: req.body.zipcode,
          arrived: req.body.arrived,
        },
      },
    },
  })

  return res.status(200).json({ message: 'Shipping info submitted' })
}
