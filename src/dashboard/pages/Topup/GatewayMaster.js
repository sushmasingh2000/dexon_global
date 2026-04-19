import { apiConnectorGet } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { useQuery } from "react-query";
import CryptoFitGateway from "./CryptoFitGateway";
import TopupUpWithoutPull from "./TopupUpWithoutPull";

const GatwayMaster = () => {

    const { data } = useQuery(
        ["master_data"],
        () => apiConnectorGet(endpoint?.get_master_data),
        {
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: true,
            retryOnMount: true,
            refetchOnWindowFocus: true,
        },
    );
    const master_data = data?.data?.result?.find((i) => i?.m00_id === 13) || []


    return (<>
        {master_data?.m00_value === "2" ? <TopupUpWithoutPull /> : <CryptoFitGateway />}
    </>)
}

export default GatwayMaster