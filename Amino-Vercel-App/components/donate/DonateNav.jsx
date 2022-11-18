import { useRouter } from 'next/router'
import Link from 'next/link'

const DonateNav = () => {
  const { pathname } = useRouter()
  const path = pathname.substring(pathname.lastIndexOf('/'))

  return (
    <div className="flex w-1/3 px-20 py-5 justify-between">
      {path !== '/biobank' &&
      path !== '/appointmentConfirmed' &&
      pathname !== '/donate' ? (
        <Link href="/donate">
          <div className="pb-[4px] hover:pb-0 hover:border-b-4 hover:border-black hover:text-black cursor-pointer transition p-2 rounded text-main font-satoshiMedium text-2xl">
            Donations
          </div>
        </Link>
      ) : (
        <div className="pb-0 border-b-4 border-black text-black cursor-pointer transition p-2 rounded font-satoshiMedium text-2xl">
          Donations
        </div>
      )}
      {pathname !== '/donate/earnings' ? (
        <Link href="/donate/earnings">
          <div className="pb-[4px] hover:pb-0 hover:border-b-4 hover:border-black hover:text-black cursor-pointer transition p-2 rounded text-main font-satoshiMedium text-2xl">
            Earnings
          </div>
        </Link>
      ) : (
        <div className="pb-0 border-b-4 border-black text-black cursor-pointer transition p-2 rounded font-satoshiMedium text-2xl">
          Earnings
        </div>
      )}
      {pathname !== '/donate/profile' ? (
        <Link href="/donate/profile">
          <div className="pb-[4px] hover:pb-0 hover:border-b-4 hover:border-black hover:text-black cursor-pointer transition p-2 rounded text-main font-satoshiMedium text-2xl">
            Profile
          </div>
        </Link>
      ) : (
        <div className="pb-0 border-b-4 border-black text-black cursor-pointer transition p-2 rounded font-satoshiMedium text-2xl">
          Profile
        </div>
      )}
    </div>
  )
}

export default DonateNav
