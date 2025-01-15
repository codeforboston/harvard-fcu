import * as React from "react";
import { EligibilityAppStates } from './types';

// type Props = React.PropsWithChildren<object>;
type Props = {
    setPageState: React.Dispatch<React.SetStateAction<EligibilityAppStates>>;
  }

const ffaUrl = 'https://financialfitnessassociation.org'

const NotEligiblePage: React.FC<Props> = (props: Props) => {
    const { setPageState } = props;

    return (
        <>
            <h3 className='elig-h3'>
                Sadly, that address is outside of our coverage area. But don't worry, there are still other options!
            </h3>
            <p className='elig-p'>
                You can also qualify by your workplace, school, or place of worship! If you haven't checked those, try again to see if you qualify!
            </p>
            <div>
                <h4 className='elig-h4'>Financial Fitness Association</h4>
                <p className='elig-p'>
                    If you become a member of the Financial Fitness Association, then you automatically qualify for membership at Harvard FCU. Harvard FCU will cover the $8 annual membership fee for the first year, and there is no obligation for you to renew your FFA membership after that; once you are a member of the Credit Union, you're a member for life!
                </p>
                <div className='elig-button-wrapper'>
                    <button className='elig-button' type='button' onClick={() => setPageState('search')}>Try Another Address</button>
                    <a className='elig-a' href = {ffaUrl} target="_blank">
                        {'Learn More About the FFA >'}
                    </a>
                </div>
            </div>

        </>
    )
}

export default NotEligiblePage;