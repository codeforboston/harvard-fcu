import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { CSSProperties, forwardRef, useEffect, useRef } from "react";


type Props = {
    style?: CSSProperties,
    className?: string,
    placeholder?: string
    value?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onPlaceChanged?: (place: google.maps.places.PlaceResult) => void
    name?: string
    id?: string
}

const AutocompleteInput = forwardRef<HTMLInputElement, Props>((props_, ref) => {
    const { onPlaceChanged, ...props } = props_;
    const places = useMapsLibrary('places');
    const inputRef = useRef<HTMLInputElement | undefined>(undefined);
    
    useEffect(() => {
        if (!places || !inputRef.current) 
            return;

        // instantiate a Place prediction widget that attaches to input field
        const placesWidget = new places.Autocomplete(inputRef.current, {
            strictBounds: true,
            bounds: {
                south: 42.23286,
                west: -71.22737,
                north: 42.50599,
                east: -70.89242
            }
        });

        // 'place_changed' event fires when user selects a place from the drop-down list of autosuggestions. For reference, see:
        // https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.place_changed
        placesWidget.addListener('place_changed', () => {
            const place = placesWidget.getPlace();
            onPlaceChanged?.(place);
        });
    }, [places, onPlaceChanged]);

    return (
        <input ref={(input) => {
            inputRef.current = input || undefined;
            if (ref) {
                if (typeof ref === 'function')
                    ref(input);
                else
                    ref.current = input;
            }
        }} {...props} />
    )
})
const googleAPIKey = (import.meta.env.VITE_API_KEY)
const AddressBox = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        <APIProvider apiKey={googleAPIKey}>
            <AutocompleteInput {...props} ref={ref} />
        </APIProvider>
    )
})

export default AddressBox;