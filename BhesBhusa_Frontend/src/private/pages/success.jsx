import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
  }, [sessionId]);

  return (
    <>
      <NavBar />
      <div className="p-20 flex flex-col justify-center">
        <h1>Payment Successful!</h1>
        <p>Your payment session ID is: {sessionId}</p>
      </div>
    </>
  );
};

export default SuccessPage;
