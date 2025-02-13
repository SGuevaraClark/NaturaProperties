import naturaLogoWide from '../assets/naturaLogoWide.png';

export const NavBar = () => {

    return (
        <div className='absolute top-0 left-0 w-full z-10'>
            <div>
                <img src={naturaLogoWide} alt="Natura Logo" />
                <ul>
                    <a href="#Header" className='cursor-pointer hover: text-gray-400'>Home</a>
                    <a href="#Header" className='cursor-pointer hover: text-gray-400'>About</a>
                    <a href="#Header" className='cursor-pointer hover: text-gray-400'>Properties</a>
                    <a href="#Header" className='cursor-pointer hover: text-gray-400'>Contact</a>
                </ul>
            </div>
        </div>
    )
};

