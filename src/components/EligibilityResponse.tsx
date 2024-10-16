import style from "./styles/EligibilityResponse.module.css"

interface EligibilityResponseProps {
    isValid: boolean;
}

export default function EligibilityResponse(props: EligibilityResponseProps) {
    const {isValid} = props;

    return (
        <div>
            {isValid? "Yes": "No"}
        </div>
    );
}