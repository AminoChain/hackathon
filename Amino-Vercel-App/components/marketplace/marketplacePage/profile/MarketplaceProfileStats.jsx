const MarketplaceProfileStats = () => {
  return (
    <div className="flex px-20 pr-32">
      <div className="flex w-full px-7 py-4 border-r-[1px] border-l-[1px] border-main rounded-md ">
        <div className="flex flex-col pr-20">
          <div className=" font-satoshiMedium text-main text-base">
            Stem Cells Purchased
          </div>
          <div className=" font-satoshiBold text-primary text-[40px]">135</div>
        </div>
        <div className="flex flex-col">
          <div className=" font-satoshiMedium text-main text-base">
            Total Spent
          </div>
          <div className="flex">
            <div className=" font-satoshiBold text-primary text-[40px]">$</div>
            <div className=" font-satoshiBold text-black text-[40px]">
              125,500,35
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceProfileStats
