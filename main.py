from src.load_data import load_citibike_data
from src.clean_data import clean_citibike_data
from src.analyze_station_activity import analyze_station_activity
from src.score_locations import score_locations
from src.create_map import create_location_map
from src.export_website_data import export_website_data


def main():
    df = load_citibike_data()
    cleaned_df = clean_citibike_data(df)
    station_activity = analyze_station_activity(cleaned_df)
    scored_locations = score_locations(station_activity)
    create_location_map(scored_locations)
    export_website_data(scored_locations)

    print("\nProject pipeline complete.")


if __name__ == "__main__":
    main()