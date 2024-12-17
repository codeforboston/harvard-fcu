import * as React from "react";
import { EligibilityAppStates } from './types';

// type Props = React.PropsWithChildren<object>;
type Props = {
    setPageState: React.Dispatch<React.SetStateAction<EligibilityAppStates>>;
  }

const NotEligiblePage: React.FC<Props> = (props: Props) => {
    const { setPageState } = props;

    return (
        <>
            <h3 className='elig-h3'>
                We're sorry, that address is outside of our coverage area. But don't worry, there are still other options!
            </h3>
            <p className='elig-p'>
                You can also qualify by your workplace, school, or place of worship. If you haven't checked those, try again to see if you qualify!
            </p>

            <div className='elig-button-wrapper'>
            <button className='elig-button' type='button' onClick={() => setPageState('search')}>Try Another Address</button>
            </div>

            <div>
            <h4 className='elig-h4'>Financial Fitness Association</h4>
            <p className='elig-p'>
                If you become a member of the Financial Fitness Association, then you automatically qualify for membership at Harvard FCU. Harvard FCU will even cover the $8 annual membership fee for the first year!
            </p>
            <button className={'elig-button elig-button-secondary'} type='button' onClick={() => location.href = '#'}>
                {'FFA Learn More >'}
                {/* https://financialfitnessassociation.org */}
            </button>
            </div>

        </>
    )
}

export default NotEligiblePage;