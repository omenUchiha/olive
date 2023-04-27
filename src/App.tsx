import { useEffect, useState } from "react";
import "./App.css";
import RouteProvider from "./modules/components/routes";
import { UserContext } from "./modules/contexts/userContext";
import { initiateSDK } from "./sdkFunctions";

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [community, setCommunity] = useState();
  useEffect(() => {
    initiateSDK(false, "0649eb6d-9fbe-4bf0-87d1-a6b660535944", "Gaurav")
      // 0d6f9958-a2db-46aa-a4b1-c40d268b767b
      // initiateSDK(false, "0d6f9958-a2db-46aa-a4b1-c40d268b767b", "")
      .then((res: any) => {
        setCommunity(res?.data?.community);
        setCurrentUser(res?.data?.user);
        sessionStorage.setItem("communityId", res?.data?.community?.id);
      })
      .catch((error) => {
        // // console.log("Error =>", error);
      });
  }, []);
  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        community,
        setCommunity,
      }}
    >
      <RouteProvider />
    </UserContext.Provider>
  );
}

export default App;
