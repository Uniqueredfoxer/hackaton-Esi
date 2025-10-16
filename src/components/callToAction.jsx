import {Link} from "react-router-dom";


const CallToAction = ({text, link, buttonText}) => {
    return (
        <div className="flex flex-col items-center gap-4 border border-[#bdbdbd25] p-20 mt-20 w-full  md:px-20 lg:rounded-[8px]">
            <h1 className="text-gray-300 font-black text-4xl">Pret a contribuer?</h1>
            <p className="text-base text-gray-500">Si vous avez des ressources à partager ou des questions, n'hésitez pas à nous le faire savoir!</p>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                <Link to="/upload" className="inline-block bg-green-700/25 hover:bg-green-700/50 transition-colors duration-300 ease-in-out font-semibold py-2 px-4 rounded-md text-green-400 ">televerser</Link>
                <Link to="/ask" className="inline-block bg-blue-700/25 hover:bg-blue-700/50 transition-colors duration-300 ease-in-out font-semibold py-2 px-4 rounded-md text-blue-400">poser une question</Link>
            </div>
        </div>
    );
}
export default CallToAction;