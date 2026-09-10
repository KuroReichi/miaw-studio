import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { setGoogleAuth } from "../../auth/AuthCheck";

import "../styles/interface/Authentication.css";

export interface GoogleUser {
	sub: string;
	name?: string;
	given_name?: string;
	family_name?: string;
	email?: string;
	email_verified?: boolean;
	picture?: string;
	locale?: string;
}

function Authentication(): React.JSX.Element {
	const speedLines = [
		{ line: 1, className: "speed-line", style: { top: "15%", left: "-300px", width: "300px" } },
		{ line: 2, className: "speed-line", style: { top: "35%", left: "-500px", width: "500px" } },
		{ line: 3, className: "speed-line", style: { top: "55%", left: "-250px", width: "250px" } },
		{ line: 4, className: "speed-line", style: { top: "75%", left: "-400px", width: "400px" } },
		{ line: 5, className: "speed-line", style: { top: "85%", left: "-350px", width: "350px" } },
		{ line: 6, className: "speed-line", style: { top: "45%", right: "-450px", width: "450px" } }
	] as const;

	return (
		<div id="login-screen" className="active">
			<div className="bg-lines-container" aria-hidden="true">
				{speedLines.map((line) => (
					<div key={line.line} className={line.className} data-line={line.line} style={line.style as React.CSSProperties} />
				))}
			</div>

			<div className="bg-overlay" aria-hidden="true" />

			<div className="login-box-wrapper">
				<div className="login-box">
					<div className="login-glow" aria-hidden="true" />

					<div className="login-logo">
						<div className="logo-ring" aria-hidden="true" />
						<img src="/favicon.png" alt="MIAW Studio" />
					</div>

					<div className="login-header">
						<h1>MIAW Studio</h1>
						<p className="login-subtitle">Connect your account to continue.</p>
					</div>

					<div className="login-action">
						<div id="btn-login">
							<GoogleLogin
								onSuccess={(response) => {
									if (!response.credential) {
										console.error("Google Auth: credential is missing.");
										return;
									}

									const user = jwtDecode<GoogleUser>(response.credential);

									console.log("Google user:", user);
									console.log("ID:", user.sub);
									console.log("Name:", user.name);
									console.log("Email:", user.email);
									console.log("Picture:", user.picture);

									setGoogleAuth(response.credential);
								}}
								onError={() => {
									console.error("Google Login failed.");
								}}
								use_fedcm_for_button={true}
								useOneTap={true}
								auto_select={true}
								cancel_on_tap_outside={false}
								type="standard"
								theme="filled_black"
								size="large"
								text="continue_with"
								shape="rectangular"
								logo_alignment="left"
								width="271"
							/>
						</div>
					</div>

					<div className="login-footer">
						<p>Secure access for your account.</p>
						<p className="footer-mini">
							By continuing, you agree to our{" "}
							<a href="/terms" target="_blank" rel="noreferrer">
								terms
							</a>{" "}
							and{" "}
							<a href="/privacy" target="_blank" rel="noreferrer">
								privacy policy
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Authentication;
