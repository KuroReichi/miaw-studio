import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { UserAuth, useUserAuth, getGoogleUser } from "../auth/AuthCheck";
import Authentication from "./screen/Authentication";

import "./styles/animations/LoadingAnimation.css";

import AppBar from "./components/AppBar";
import Container from "./components/Container";
import Tab from "./components/TabNavigation";
import Overlay from "./components/Overlay";

import { Changelogs } from "./components/pages/Changelogs";

interface GoogleUser {
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	email: string;
	email_verified: boolean;
	nonce: string;
	nbf: number;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: number;
	exp: number;
	jti: string;
}

const GOOGLE_CLIENT_ID = "608117489686-0chu2epsol2omo8hvst8sm3deblcthum.apps.googleusercontent.com";

const pages = {
	global: {
		icon: "public",
		label: "In-Game Chat",
		padding: false,
		component: <div>Global Chat</div>
	},
	friends: {
		icon: "groups",
		label: "Player List",
		padding: true,
		component: <div>Friends</div>
	},
	changelogs: {
		icon: "deployed_code_history",
		label: "Changelogs",
		padding: true,
		component: <Changelogs />
	},
	account: {
		icon: "settings_account_box",
		label: "Account",
		padding: false,
		component: <div>Account</div>
	}
} as const;
type Page = keyof typeof pages;

function AppContent(): React.JSX.Element {
	const auth = useUserAuth();
	const [currentPage, setCurrentPage] = React.useState<Page>("global");

	if (!auth.authenticated) {
		return <Authentication />;
	}

	return (
		<div className="app">
			<AppBar />
			<Container pages={pages} currentPage={currentPage} />
			<Tab pages={pages} currentPage={currentPage} onNavigate={setCurrentPage} />
		</div>
	);
}

async function delay(time?: number) {
	return new Promise((resolve) => setTimeout(() => resolve(true), time ?? Math.random() * 350));
}
function App(): React.JSX.Element {
	const [hidden, setHide] = React.useState(false);
	const [body, setBody] = React.useState("Checking Authentication State...");

	React.useEffect(() => {
		return () => {
			async function init() {
				setBody("Checking Authentication State...");
				await delay();
				UserAuth().then(async (authenticated) => {
					if (!authenticated) {
						setBody("User haven't logged in");
					} else {
						const user = getGoogleUser() as GoogleUser;
						if (user.email_verified) setBody("Account Retrived");
						await delay();
						setBody("Preparing Resources...");
						await delay();
					}

					setTimeout(() => setHide(true), Math.random() * 100);
				});
			}
			init();
		};
	}, []);

	return (
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<div className={["miaw-loader", hidden ? "hide" : null].join(" ")}>
				<div datatype="loader">
					<div data-loader-line="1" />
					<div data-loader-line="2" />
					<div data-loader-line="3" />
				</div>

				<span datatype="header">MIAW Studio</span>
				<span datatype="body">{body}</span>
			</div>
			<AppContent />
			<Overlay />
		</GoogleOAuthProvider>
	);
}

export default App;
