import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: import.meta.env.VITE_API_KEY,
  version: 'beta',
  libraries: ['places'],
});

export default loader;
