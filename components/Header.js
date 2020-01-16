import Link from 'next/link';

const linkStyle = {
    marginRight: 15
};

const Header = () => (
    <div>
        <Link href="/">
            <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/about">
            <a style={linkStyle}>About</a>
        </Link>
        <Link href="/face-detection">
            <a style={linkStyle}>Face detection</a>
        </Link>
        <Link href="/webcam-detection">
            <a style={linkStyle}>Webcam detection</a>
        </Link>
    </div>
);

export default Header;