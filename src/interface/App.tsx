import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { UserAuth, useUserAuth, getGoogleUser } from "@legiun/auth/AuthCheck";
import Authentication from "@legiun/screen/Authentication";

import "@legiun/styles/animations/LoadingAnimation.css";

import AppBar from "@legiun/components/AppBar";
import Container from "@legiun/components/Container";
import Tab from "@legiun/components/TabNavigation";
import Overlay from "@legiun/components/Overlay";

import { Home } from "@legiun/pages/Home";
import { Projects } from "@legiun/pages/Projects";

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
	home: {
		icon: "home",
		label: "Home",
		padding: true,
		component: <Home />
	},
	projects: {
		icon: "folder_code",
		label: "Projects",
		padding: true,
		component: <Projects />
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
	const [currentPage, setCurrentPage] = React.useState<Page>("home");

	if (!auth.authenticated) {
		return <Authentication />;
	}

	return (
		<div className="app">
			<AppBar />
			<Container pages={pages} currentPage={currentPage} onNavigate={setCurrentPage} />
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
		async function init() {
			setBody("Checking Authentication State...");
			await delay();
			const authenticated = await UserAuth();
			if (!authenticated) {
				setBody("User haven't logged in");
			} else {
				const user = getGoogleUser() as GoogleUser;

				if (user?.email_verified) {
					setBody("Account Retrived");
				}

				await delay();
				setBody("Preparing Resources...");
				await delay();
			}
			setTimeout(() => setHide(true), Math.random() * 100);
		}

		init();
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
