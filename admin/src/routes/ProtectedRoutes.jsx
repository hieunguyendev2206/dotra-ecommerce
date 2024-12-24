/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {useSelector} from "react-redux";
import {Suspense} from "react";
import {Navigate} from "react-router-dom";
import path from "../constants/path";

const ProtectedRoutes = ({route, children}) => {
    const {user_info, role} = useSelector((state) => state.auth);
    if (role) {
        if (user_info) {
            if (route.role) {
                if (user_info.role === route.role) {
                    if (route.status) {
                        if (route.status === user_info.status) {
                            return <Suspense fallback={null}>{children}</Suspense>;
                        } else {
                            if (user_info.status === "pending") {
                                return <Navigate to={path.seller_account_pending} replace/>;
                            } else {
                                return <Navigate to={path.seller_account_deactive} replace/>;
                            }
                        }
                    } else {
                        if (route.visibility) {
                            if (route.visibility.some((r) => r === user_info.status)) {
                                return <Suspense fallback={null}>{children}</Suspense>;
                            } else {
                                return <Navigate to={path.seller_account_pending} replace/>;
                            }
                        } else {
                            return <Suspense fallback={null}>{children}</Suspense>;
                        }
                    }
                } else {
                    return <Navigate to={path.unauthorized} replace/>;
                }
            } else {
                if (route.ability === "seller") {
                    return <Suspense fallback={null}>{children}</Suspense>;
                }
            }
        }
    } else {
        return <Navigate to={path.seller_login} replace/>;
    }
};

export default ProtectedRoutes;
