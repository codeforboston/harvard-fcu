import * as React from "react";

type Props = React.PropsWithChildren<object>;

const EligiblePage: React.FC<Props> = () => {
    return (
        <>
            <h3 className='elig-h3'>
                Congrats! It looks like you are eligible for membership! 
            </h3>
            <p className='elig-p'>
                Click the link below to start your application! Make sure you have the following ready before you start the application:
            </p>
            <ul className='elig-ul'>
                <li>Valid Social Security #</li>
                <li>Valid government issued ID #</li>
                <li>Date of Birth</li>
                <li>Address, Email address and phone number</li>
                <li>Work ID (if applicable)</li>
                <li>Your mobile phone</li>
            </ul>
            <div className='elig-button-wrapper'>
            <button className='elig-button' type='button' onClick={() => location.href = "#"}>{'Join Today! >'}</button>
            <a href='#' className='elig-a'>Learn More About Memberships</a>
        </div>
        </>
    )
}

export default EligiblePage;