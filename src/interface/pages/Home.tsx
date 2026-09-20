import "@legiun/styles/interface/pages/Home.css";

export function Home(): React.JSX.Element {
	return (
		<div className="">
			<div className="chat-header">
				<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
					<span className="icon">person</span>
					<span>0 Online</span>
				</div>
				<span className="icon">lock</span>
			</div>
			<a>
				lorem ipsum dolor sit amet consectetur adipiscing elit voluptas qui dolore soluta eu vel pariatur magna id quidem elit elit
				maxime in in vero id elit iusto similique ad vero dignissimos exercitation amet dolores aute facilis iusto dolor quo qui
				dolore et dolor lorem iusto quo optio est mollitia deleniti
			</a>
		</div>
	);
}
