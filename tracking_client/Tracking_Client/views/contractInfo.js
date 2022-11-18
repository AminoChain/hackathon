class contactInfo{
    #contract_address
    #name
    #abi


    setContractAddress(contract_address){
        this.contract_address = contract_address
    }

    getContractAddress(){
        return this.#contract_address
    }

    setName(name){
        this.#name = name
    }

    getName(){
        return this.#name
    }

    setABI(abi){
        this.#abi = abi
    }

    getABI(){
        return this.#abi
    }

}

module.exports = contactInfo