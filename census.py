import requests
import pandas as pd

def load_census_tracts_from_csv(file_path):
    # Load the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)
    
    # Extract the 'tracts' column as a list
    tracts_list = df['tracts'].astype(str).tolist()
    
    return tracts_list

def check_address_in_census_tract(street, city, state, zip_code, tracts_file):
    # Load the list of census tracts from the CSV file
    census_tracts_ma = load_census_tracts_from_csv(tracts_file)
    
    # API URL for Census Geocoding (Geographies endpoint)
    url = "https://geocoding.geo.census.gov/geocoder/geographies/address"
    
    # Parameters for the API request
    params = {
        'street': street,
        'city': city,
        'state': state,
        'zip': zip_code,
        'benchmark': 'Public_AR_Census2020',  # Use the 2020 Census benchmark
        'vintage': 'Census2020_Census2020',  # Census 2020 vintage data
        'layers': 'tract',  # Specify layers for census tract
        'format': 'json'  # Get the response in JSON format
    }
    
    # Send the GET request to the Census Geocoder API
    response = requests.get(url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        
        # Check if the geocoding was successful and data was returned
        if 'result' in data and 'addressMatches' in data['result'] and data['result']['addressMatches']:
            # Extract the first matching address
            address_match = data['result']['addressMatches'][0]
            
            # Check if 'geographies' exists in the response
            if 'geographies' in address_match and 'Census Tracts' in address_match['geographies']:
                # Extract the census tract
                census_tract = address_match['geographies']['Census Tracts'][0]['GEOID']
                
                # Check if the census tract is in the predefined list of census tracts
                if census_tract in census_tracts_ma:
                    print(f"Address '{street}, {city}, {state} {zip_code}' is an eligible address.")
                else:
                    print(f"Address '{street}, {city}, {state} {zip_code}' is not eligible.")
            else:
                print(f"Geographies information not found for the address: '{street}, {city}, {state} {zip_code}'.")
        else:
            print(f"Address '{street}, {city}, {state} {zip_code}' could not be geocoded or is not found.")
    else:
        print(f"Failed to connect to the Census API. Status code: {response.status_code}")

# Example usage
tracts_file_path = "tracts.csv"  # Path to the CSV file containing the tracts
check_address_in_census_tract(
    street="77 Massachusetts Ave", 
    city="Cambridge", 
    state="MA", 
    zip_code="02139",
    tracts_file=tracts_file_path
)
