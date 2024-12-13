export function encodeQueryParams(params: Record<string, string>) {
  return Object.entries(params).map(([key, val]) => (
    key + '=' + encodeURIComponent(val)
  )).join('&');
}

type JsonpParams = {
  url: string,
  queryParams?: object,
  callbackParam?: string,
};

// Function to load JSONP data, creating a script tag and defining a global callback
export function loadJsonp<T = object>(params: JsonpParams): Promise<T> {
  const { queryParams = {}, callbackParam = 'callback' } = params;

  const n = Math.floor(Math.random()*100000000);
  const functionName = `randomname_${n}`; // JSONP callback function name
  const queryString = encodeQueryParams(Object.assign(
    { [callbackParam]: functionName },
    queryParams
  ));

  // Construct URL with encoded parameters and load JSONP data
  const url = params.url + '?' + queryString;

  return new Promise((resolve, reject) => {
    // Define the callback function randomname_xxxx on window['randomname_xxxx]
    // Create script tag, w/ src, crossorigin, onerror
    //    src = url + format=jsonp, callback=
    // Insert script into head (or update virtual script element)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[functionName] = function(result: T | PromiseLike<T>) {
      resolve(result); // Resolve the promise with the result on success
    }
    const script = document.createElement("script"); // Create script element
    script.src = url; // Set URL as script source
    // Reject promise if loading fails
    script.onerror = (e) => {
      reject(e);
      // delete (window as any)[functionName];
    };

    // script.onload = () => {
    //   setTimeout(() => { delete (window as any)[functionName] }, 0);
    // }
    document.head.appendChild(script); // Append script to document head
  })
}
