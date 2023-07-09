import logo from '../../images/pokemon-logo.png'
import { Link } from 'react-router-dom'

function Logo() {
    return (
        <Link to="/">
            <img src={logo} className='logo' alt='logo' />
        </Link>

    )
}

export default Logo