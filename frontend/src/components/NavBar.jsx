import naturaLogoWide from '../assets/naturaLogoWide.png';

export const NavBar = () => {

    return (
        <div className='absolute top-0 left-0 w-full z-10'>
            <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32bg-transparent'>
                <img src={naturaLogoWide} alt="Natura Logo"/>
                <ul>
                    <a href="#Header" className='cursor-pointer hover:text-gray-400'>Home</a>
                    <a href="#Header" className='cursor-pointer hover:text-gray-400'>About</a>
                    <a href="#Header" className='cursor-pointer hover:text-gray-400'>Properties</a>
                    <a href="#Header" className='cursor-pointer hover:text-gray-400'>Contact</a>
                </ul>
                <button className="hidden md:block bg-white px-8 py-2 rounded-full">Sign up</button>
            </div>
        </div>
    )
};

