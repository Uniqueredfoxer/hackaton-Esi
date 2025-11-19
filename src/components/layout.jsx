import Header from "./header";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

const Layout = () =>{
    return(
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col items-center flex-grow w-full min-h-[calc(100vh-64px)] mt-16 py-10 bg-[#111]">
                <div className="container max-w-7xl">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;