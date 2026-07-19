from pathlib import Path
import pandas as pd


def score_locations(station_activity):
    """
    Score Citi Bike station areas for potential food-cart locations.

    Higher score = stronger potential location.
    """

    print("\nScoring potential food-cart locations...")

    df = station_activity.copy()

    # Avoid division errors
    df = df[df["total_trips"] > 0]

    # Normalize columns so they are comparable
    df["total_trips_score"] = df["total_trips"] / df["total_trips"].max()
    df["lunch_trips_score"] = df["lunch_hour_trips"] / df["lunch_hour_trips"].max()
    df["lunch_share_score"] = df["lunch_hour_share"] / df["lunch_hour_share"].max()
    df["weekday_score"] = df["weekday_trips"] / df["weekday_trips"].max()
    df["casual_score"] = df["casual_trips"] / df["casual_trips"].max()

    # Weighted food-cart score
    df["food_cart_score"] = (
        0.35 * df["lunch_trips_score"]
        + 0.25 * df["total_trips_score"]
        + 0.20 * df["weekday_score"]
        + 0.10 * df["lunch_share_score"]
        + 0.10 * df["casual_score"]
    )

    # Sort best locations first
    df = df.sort_values(by="food_cart_score", ascending=False)

    # Save scored output
    output_path = Path("data/processed/scored_food_cart_locations.csv")
    df.to_csv(output_path, index=False)

    print(f"Scored locations saved to: {output_path}")

    print("\nTop 10 potential food-cart locations:")
    print(
        df[
            [
                "start_station_name",
                "total_trips",
                "lunch_hour_trips",
                "lunch_hour_share",
                "weekday_trips",
                "casual_trips",
                "food_cart_score",
            ]
        ].head(10)
    )

    return df