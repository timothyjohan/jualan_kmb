import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <>
        
            <nav className="border-gray-200 bg-zinc-900 mb-16">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-bold whitespace-nowrap text-white">KMB ADMIN</span>
                    </div>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  border-gray-700">
                        <li>
                            <Link to={"/"}><a className="block py-2 px-3 text-white rounded md:p-0 text-zinc-100" aria-current="page">Home</a></Link>
                        </li>
                    
                        <li>
                            <Link to={"/list"}><a className="block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:p-0 text-white hover:text-zinc-300">List</a></Link>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}