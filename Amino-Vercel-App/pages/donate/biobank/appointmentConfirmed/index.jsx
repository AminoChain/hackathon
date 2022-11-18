import { useState } from 'react'
import DonateBanner from '../../../../components/donate/DonateBanner'
import AppointmentConfirmedPage from '../../../../components/donate/donatesearch/donateSchedule/appointmentConfirmed/AppointmentConfirmedPage'
import prisma from '../../../../lib/prisma'

export async function getServerSideProps(context) {
  const { bioBankId } = context.query

  const bioBank = await prisma.bioBank.findUnique({
    where: {
      id: bioBankId,
    },
  })

  return {
    props: { bioBank: bioBank }, // will be passed to the page component as props
  }
}

const AppointmentConfirmed = ({ bioBank }) => {
  const [progress, setProgress] = useState(4)

  return (
    <div className="w-screen">
      <DonateBanner />
      <AppointmentConfirmedPage progress={progress} bioBank={bioBank} />
    </div>
  )
}

export default AppointmentConfirmed
