import axios from "axios";

export class Api {
    constructor() {
        // TODO get env - process.env - to work
        //this.baseUrl = `${process.env.VITE_APP_API_BASE_URI}`;
        this.baseUrl = "http://localhost:8000";
        this.axiosConfig = {
            withCredentials: false,
        };
        this.headers = {
            "Access-Control-Allow-Origin": "http://localhost:8000",
        };
    }
    /**
     * @walletBalance
     */
    async walletBalance() {
        let config = this.axiosConfig;
        config["headers"] = this.headers;

        return await axios.get(`${this.baseUrl}/wallet-balance`, config)
            .then((res) => {

                return res.data.data;
            })
            .catch((err) => {
                console.log("An error occurred communicating with the API while fetching bitcoin balance: ", err)
                return null;
            })
    }
    /**
     * @listAssets
     */
    async listAssets() {
        let config = this.axiosConfig;
        config["headers"] = this.headers;

        return await axios.get(`${this.baseUrl}/list-assets`, config)
            .then((res) => {

                return res.data.data;
            })
            .catch((err) => {
                console.log("An error occurred communicating with the API while fetching taproot assets: ", err)
                return null;
            })
    }

    /**
     * @mintAsset
     */
    async mintAsset(asset) {
        let config = this.axiosConfig;
        config["headers"] = this.headers;

        return await axios.post(`${this.baseUrl}/mint-asset`, config, asset)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log("An error occurred communicating with the API while preparing a new asset for mint: ", err)
                return null;
            })
    }
    /**
     * @mintNewGroup
     * 
     * @TODO determine if this requires own endpoint or should share use of mintAsset / mint-asset
     */
    async mintNewGroup(name, amount) {
        let config = this.axiosConfig;
        config["headers"] = this.headers;

        return await axios.post(`${this.baseUrl}/mint-asset`, config, {"name": name, "amount": parseInt(amount)})
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log("An error occurred communicating with the API while preparing a mint of an asset group: ", err)
                return null;
            })
    }
    /**
     * @finalizeBatches
     */
    async finalizeBatches() {
        let config = this.axiosConfig;
        config["headers"] = this.headers;

        return await axios.post(`${this.baseUrl}/finalize-batches`, config)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log("An error occurred communicating with the API while finalizing prepared batches: ", err)
                return null;
            })
    }
}

