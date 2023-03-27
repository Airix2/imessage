import { Session } from "next-auth";
import React from "react";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper = ({ session }: FeedWrapperProps) => {
	return <div>FeedWrapper</div>;
};

export default FeedWrapper;
