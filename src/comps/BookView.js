import Link from "next/link";




function Books({books}){
    return (
        <div class="Books">
            {books.map(({image, title, author, releaseInfo}, i) => (
                    <div class="Book" key={i}>
                        <img src={image} alt="bookCover"></img>
                            <div class="BookInfo">
                                <h1>{title}</h1>
                                <h2>{author} | {releaseInfo} </h2>
                            </div>
                    </div>
            ))}
    </div>
    );
}

export default Books;