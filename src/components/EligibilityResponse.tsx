import style from "./styles/EligibilityResponse.module.css"

interface EligibilityResponseProps {
    isValid: boolean;
}

export default function EligibilityResponse(props: EligibilityResponseProps) {
    const {isValid} = props;

    return (
        <div>
            {isValid? "Congrats! It looks like you are eligible for membership!": "That address is outside of our coverage area."}
        </div>
    );
}