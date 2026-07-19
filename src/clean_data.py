from pathlib import Path
import pandas as pd


def clean_citibike_data(df):
    """
    Clean Citi Bike trip data and prepare it for analysis.
    """

    print("\nStarting data cleaning...")

    # Convert time columns to datetime
    df["started_at"] = pd.to_datetime(df["started_at"], errors="coerce")
    df["ended_at"] = pd.to_datetime(df["ended_at"], errors="coerce")

    # Create useful time columns
    df["trip_date"] = df["started_at"].dt.date
    df["start_hour"] = df["started_at"].dt.hour
    df["day_of_week"] = df["started_at"].dt.day_name()
    df["is_weekend"] = df["day_of_week"].isin(["Saturday", "Sunday"])

    # Create trip duration in minutes
    df["trip_duration_minutes"] = (
        df["ended_at"] - df["started_at"]
    ).dt.total_seconds() / 60

    # Keep only useful columns for this project
    columns_to_keep = [
        "ride_id",
        "rideable_type",
        "started_at",
        "ended_at",
        "trip_date",
        "start_hour",
        "day_of_week",
        "is_weekend",
        "trip_duration_minutes",
        "start_station_name",
        "start_station_id",
        "end_station_name",
        "end_station_id",
        "start_lat",
        "start_lng",
        "end_lat",
        "end_lng",
        "member_casual",
    ]

    df = df[columns_to_keep]

    # Remove rows missing key start-station information
    df = df.dropna(
        subset=[
            "started_at",
            "ended_at",
            "start_station_name",
            "start_lat",
            "start_lng",
        ]
    )

    # Remove unrealistic trip durations
    df = df[df["trip_duration_minutes"] > 0]
    df = df[df["trip_duration_minutes"] <= 180]

    # Save cleaned file
    output_path = Path("data/processed/citibike_march_2026_cleaned.csv")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    df.to_csv(output_path, index=False)

    print(f"Cleaned dataset shape: {df.shape}")
    print(f"Cleaned file saved to: {output_path}")

    return df