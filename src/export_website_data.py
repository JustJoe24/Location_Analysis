from pathlib import Path
import pandas as pd


def export_website_data(scored_locations):
    """
    Export scored locations to JSON for the website.
    """

    print("\nExporting website data...")

    website_data_path = Path("website/data")
    website_data_path.mkdir(parents=True, exist_ok=True)

    columns_for_website = [
        "start_station_name",
        "start_station_id",
        "start_lat",
        "start_lng",
        "total_trips",
        "lunch_hour_trips",
        "lunch_hour_share",
        "weekday_trips",
        "weekend_trips",
        "casual_trips",
        "member_trips",
        "food_cart_score",
    ]

    website_df = scored_locations[columns_for_website].copy()

    output_path = website_data_path / "scored_food_cart_locations.json"

    website_df.to_json(
        output_path,
        orient="records",
        indent=2
    )

    print(f"Website JSON saved to: {output_path}")

    return website_df