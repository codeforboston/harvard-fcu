import * as React from "react";

type Props = React.PropsWithChildren<object>;

const SuccessPage: React.FC<Props> = () => {
    return (
        <>
            <h3 className='elig-h3'>
                Congrats! It looks like you are eligible for membership! 
            </h3>
            <p className='elig-p'>
                Click the link below to start your application! Make sure have the following ready before you start the application!
            </p>
            <div className='elig-button-wrapper'>

            <button className='elig-button' type='submit'>Join Today!</button>

        </div>
        </>
    )
}

export default SuccessPage;