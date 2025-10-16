import DocumentCard from './documentCard'

const LatestUploadSection = () => {
    return(
        <section className=" w-full px-4 md:px-20 mt-4">

            <h1 className="text-2xl  font-bold px-5 py-2 rounded-t-[8px] w-fit text-left text-[hsl(0_0%_80%)] bg-[#222]"> Récents</h1>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 ">
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
                <DocumentCard/>
            </div>
        </section>

    )

};

export default LatestUploadSection;