/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#626262',
        primary: '#5CF1B9',
        primaryHover: `#66CCA6`,
        experiment: '#40EDED',
        main: '#8F95B2',
        pinkHLAA: '#FEC7FF',
        orangeHLAB: '#FFC077',
        blueHLAC: '#82FFFF',
        greenHLADRB: '#7FFFCF',
        yellowHLADPB: '#FFE8A3',
        white: '#FAFAFA',
        biobankCards: '#ABAFC5',
        purpleHLADQA: '#897FFF',
        gradientDonateStart: '#A9FFDC',
        gradientDonateEnd: '#16FFA1',
        marketplaceButton: '#ECF1F4',
        hiddenHla: `#F6F6F6`,
        ccBackground: `#D9FFF1`,
        priceSlider: `#D7D7D7`,
      },
      dropShadow: {
        donatebuttonIntroShadow: '12px 10px 8px rgba(52, 221, 152, 0.4)',
        marketplaceButtonShadow1: '12px 10px 8px rgba(64, 237, 237, 0.4)',
        searchButtonShadow: '12px 10px 8px rgba(64, 237, 237, 0.4)',
        metamaskShadow: `12px 10px 8px rgba(245, 132, 31, 0.24)`,
        coinbaseShadow: `12px 10px 8px rgba(40, 96, 242, 0.24)`,
        walletconnectShadow: `12px 10px 8px rgba(64, 143, 249, 0.24)`,
        nftCard: '8px 8px 6px rgba(127, 255, 207, 0.4)',
      },
      boxShadow: {
        nft: '12px 10px 8px rgba(254, 199, 255, 1)',
        bioBankCard: '12px 10px 8px rgba(143, 149, 178, 0.24)',
      },
      fontFamily: {
        satoshiRegular: ['Satoshi-Regular'],
        satoshiBold: ['Satoshi-Bold'],
        satoshiLight: ['Satoshi-Light'],
        satoshiVariable: ['Satoshi-Variable'],
        satoshiMedium: ['Satoshi-Medium'],
        satoshiBlack: ['Satoshi-Black'],
        satoshiItalic: ['Satoshi-Italic'],
        satoshiBlackItalic: ['Satoshi-BlackItalic'],
        satoshiVariableItalic: ['Satoshi-VariableItalic'],
        satoshiLightItalic: ['Satoshi-LightItalic'],
        satoshiMediumItalic: ['Satoshi-MediumItalic'],
        satoshiBoldItalic: ['Satoshi-BoldItalic'],
      },
    },
  },
  plugins: [],
}