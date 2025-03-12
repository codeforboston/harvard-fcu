import { CSSProperties, forwardRef, useEffect, useRef, useState, } from "react";
import { Loader } from '@googlemaps/js-api-loader';


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

const loader = new Loader({
  apiKey: import.meta.env.VITE_API_KEY,
  version: 'beta',
  libraries: ['places'],
});

function usePromise<T>(p: Promise<T>) {
  const [val, setVal] = useState<T | null>(null);

  useEffect(() => {
    let mounted = true;

    p.then((v) => {
      if (mounted)
        setVal(() => v);
    });

    return () => { mounted = false; };
  }, [p]);

  return val;
}

function useSearchBox() {
  return usePromise(loader.importLibrary('places').then(l => l.SearchBox));
}

const AutocompleteInput = forwardRef<HTMLInputElement, Props>((props_, ref) => {
  const { onPlaceChanged, ...props } = props_;

  const inputRef = useRef<HTMLInputElement | undefined>(undefined);
  const SearchBox = useSearchBox();
  useEffect(() => {
    if (!SearchBox || !inputRef.current)
      return;

    // instantiate a Place prediction widget that attaches to input field
    const placesWidget = new SearchBox(inputRef.current, {
      bounds: {
        south: 42.23286,
        west: -71.22737,
        north: 42.50599,
        east: -70.89242
      }
    });

    // 'place_changed' event fires when user selects a place from the drop-down list of autosuggestions.
    placesWidget.addListener('place_changed', () => {
      const places = placesWidget.getPlaces();
      console.log('places', places);
      if (places)
        onPlaceChanged?.(places[0]);
    });

  }, [SearchBox, onPlaceChanged]);

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
});

const AddressBox = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        <AutocompleteInput {...props} ref={ref} />
    )
});

export default AddressBox;
