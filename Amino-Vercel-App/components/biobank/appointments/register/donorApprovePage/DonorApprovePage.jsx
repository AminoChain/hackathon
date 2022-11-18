import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { Contract, ethers } from 'ethers'
import { abis, contractAddresses } from '../../../../../constants/index'
import DonationSuccessfulNftCard from './DonationSuccessfulNftCard'
import checkGreen from '../../../../../assets/success.png'
import share from '../../../../../assets/share.png'
import confetti from '../../../../../assets/confetti.gif'
import { platformBackend } from '../../../../../context/state'

export const mumbaiChainId = 80001
export const polygonChainId = 137
export const currentChainId = mumbaiChainId
// const platformBackend = "http://localhost:3003/"

const DonorApprovePage = ({ hla, biobankAddress }) => {
  const [error, setError] = useState('')
  const [connectingWallet, setConnectingWallet] = useState(false)
  const [waitingForApprove, setWaitingForApprove] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [finished, setFinished] = useState(false)
  const [registrationTx, setRegistrationTx] = useState(false)

  useEffect(() => {
    setConnectingWallet(true)
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
    })

    connector.on('session_update', (error, payload) => {
      if (error) {
        setError(error.toString())
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
    })

    connector.on('disconnect', (error, payload) => {
      if (error) {
        setError(error.toString())
      }
    })

    connector.connect().then(async ({ accounts, chainId }) => {
      const [account] = accounts

      setConnectingWallet(false)

      const authenticator = new Contract(
        contractAddresses.authenticator,
        abis.authenticator,
        new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      )

      let hlaHash = ethers.utils.id(JSON.stringify(hla))
      const registrationParametersHash =
        await authenticator.getRegistrationHash(account, hlaHash)

      // console.log(accounts, chainId)
      connector
        .signMessage([account, registrationParametersHash])
        .then(async (signature) => {
          console.log(signature)

          setWaitingForApprove(false)
          setRegistering(true)

          const response = await fetch(platformBackend + `register-donation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hla,
              biobankAddress,
              donorAddress: account,
              amounts: [20, 10],
              signature,
              genome: 'genome',
            }),
          })

          setRegistering(false)

          if (response.ok) {
            setRegistrationTx(await response.text())
            setFinished(true)
          } else {
            setError('Registration error')
          }
        })
        .catch((error) => {
          setError(error.toString())
          setConnectingWallet(false)
        })
      // if (chainId === currentChainId) {
      // }
    })
  }, [])

  return (
    <div className={`w-full ${finished ? 'confettiBG' : null}`}>
      <div className="w-full flex flex-col px-36 py-10">
        <div className="flex flex-col items-center text-5xl text-black py-3 font-satoshi">
          {!connectingWallet &&
            !waitingForApprove &&
            !registering &&
            !finished && (
              <div>Sign message in Metamask on your mobile phone</div>
            )}
          <div>{error}</div>
          {connectingWallet && <div>Connecting...</div>}
          {waitingForApprove && <div>Waiting for approve...</div>}
          {registering && <div>Registering...</div>}
          {finished && (
            <div>
              <div className="flex flex-col items-center font-satoshiBold text-black text-2xl pb-10">
                <div>Verification successful</div>
                <div className="px-2">
                  <Image src={checkGreen} alt="checkgreen icon" />
                </div>
              </div>
              <DonationSuccessfulNftCard />
              <a
                className="px-6 py-3 flex items-center bg-white font-satoshiMedium text-xl border-main border rounded-full "
                href={`https://mumbai.polygonscan.com/tx/${registrationTx}`}
              >
                <div className="px-2">View on PolygonScan</div>
                <Image src={share} alt="share icon" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonorApprovePage
