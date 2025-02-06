'use client';

export default async function Footer() {
	return (
		<>
			<div
				style={{
					backgroundColor: '#1A1A2E',
					color: '#FFFFFF',
					padding: '80px',
					textAlign: 'center'
				}}
			>
				<h1 style={{ marginBottom: '20px' }}>ONLINE ART GALLERY</h1>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						flexWrap: 'wrap'
					}}
				>
					<div style={{ flex: '1', textAlign: 'center' }}>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Home
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							For Artists
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							For Art Lovers
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Pricing
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							FAQ
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Learn More
						</a>
					</div>
					<div style={{ flex: '1', textAlign: 'center' }}>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Email
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							People at LinkedIn
						</a>
					</div>
					<div style={{ flex: '1', textAlign: 'center' }}>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Login to the app
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Open your art exhibition for free
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Discover Art Exhibitions
						</a>
					</div>
					<div style={{ flex: '1', textAlign: 'center' }}>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Privacy Policy
						</a>
						<a
							href='#'
							style={{
								color: '#FFFFFF',
								textDecoration: 'none',
								margin: '0 10px'
							}}
						>
							Terms & Conditions
						</a>
					</div>
				</div>
			</div>
			<style jsx>{`
				a:hover {
					text-decoration: underline;
					color: #ffd700; /* Gold color on hover */
				}
			`}</style>
		</>
	);
}
