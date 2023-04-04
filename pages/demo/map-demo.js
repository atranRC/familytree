import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";

const Map = dynamic(() => import("../../components/places_page/Map"), {
    ssr: false,
});

export default function MapDemo() {
    const { data: session, status } = useSession();
    const [sessionUser, setSessionUser] = useState(null);

    const {
        isLoading: isLoadingUser,
        isFetching: isFetchingUser,
        data: dataUser,
        refetch: refetchUser,
        isError: isErrorUser,
        error: errorUser,
    } = useQuery({
        queryKey: "get-user",
        queryFn: () => {
            return axios.get("/api/users/users-mongoose/" + session.user.email);
        },
        enabled: status === "authenticated" ? true : false,
        onSuccess: (d) => {
            console.log("owner now fetched", d.data.data);
            setSessionUser(d.data.data);
        },
    });

    if (status === "loading" || !sessionUser) {
        console.log(status);
        return <p>loading...</p>;
    }
    if (sessionUser) {
        return (
            <div>
                <p>
                    Signed in as {session.user.email} {sessionUser.name}
                </p>
                <Map />
            </div>
        );
    }
    return <a href="/api/auth/signin">Sign in</a>;
}
