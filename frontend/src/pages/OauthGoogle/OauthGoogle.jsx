/* eslint-disable no-unused-vars */
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";
import {setCustomerAccessTokenToLS} from "../../utils/localStorage";

const OauthGoogle = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const customer_access_token = searchParams.get("customer_access_token");
        setCustomerAccessTokenToLS(customer_access_token);
        navigate("/");
        window.location.reload();
    }, [navigate, searchParams]);

    return <div>Đang xử lý...</div>;
};

export default OauthGoogle;
