<h2></h2>
<img src="https://github.com/Ashesh3/zoho-auto-attendance/assets/3626859/5063891c-7b63-4fe8-8804-010bce875d77" />
<br /><br />
<p align="center"><b>A Docker Container for Automated Zoho Attendance Check-In and Out with Optional Location and IP Spoofing</b></p>
<h2></h2>

## Prerequisites

Before you get started, ensure you have:

- ☑️ A Zoho account with access to the Zoho People service.
- ☑️ Your Zoho credentials (`zoho_username` and `zoho_password`).
- ☑️ Your Zoho organization ID (`zoho_org_id`).
- ☑️ The desired check-in and check-out times (`check_in_time` and `check_out_time`).
- ☑️ The latitude and longitude of your attendance location (`attendance_latitude` and `attendance_longitude`).
- ☑️ (Optional) A proxy server for IP spoofing.

## Configuration

Configure the Docker container using a `.env` file. Below is an example showing the main configuration variables:

```dotenv
ZOHO_EMAIL=test@test.com
ZOHO_PASSWORD=test
CHECK_IN_TIME=15:00
CHECK_OUT_TIME=23:45
ZOHO_ORG_ID=123456789
ATTENDANCE_LATITUDE=123456.789
ATTENDANCE_LONGITUDE=123456.789
LOCATION_ACCURACY_METERS=100.542
EXCLUDED_DAYS=saturday,sunday
HOLIDAY_LIST=17/04,18/05,19/06
```

| Name                        | Description                                                                                                                      | Default               |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| `ZOHO_EMAIL`                | Your Zoho account email.                                                                                                         | N/A, Required.        |
| `ZOHO_PASSWORD`             | Your Zoho account password.                                                                                                      | N/A, Required.        |
| `CHECK_IN_TIME`             | The time to automatically check you in (24-hour format, `HH:MM`).                                                                | N/A, Required.        |
| `CHECK_OUT_TIME`            | The time to automatically check you out (24-hour format, `HH:MM`).                                                               | N/A, Required.        |
| `TIMEZONE`                  | The timezone in which the check-in and check-out times are specified. [Timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                           | Asia/Kolkata                  |
| `ZOHO_ORG_ID`               | The organization ID for your Zoho account.                                                                                       | N/A, Required.        |
| `ATTENDANCE_LATITUDE`       | Latitude for attendance spoofing.                                                                                                | N/A, Required.        |
| `ATTENDANCE_LONGITUDE`      | Longitude for attendance spoofing.                                                                                               | N/A, Required.        |
| `LOCATION_ACCURACY_METERS`  | The accuracy of the spoofed location in meters.                                                                                  | 500                    |
| `PROXY`                     | (Optional) Proxy server to use for location and IP spoofing. Format: `http://username:password@proxy_address:port`.              | None                  |
| `EXCLUDED_DAYS`             | Days of the week when the attendance should not be marked, separated by commas (e.g., saturday,sunday).                                  | N/A, Optional         |
| `HOLIDAY_LIST`              | Specific dates in `dd/mm` format, separated by commas, when the attendance should not be marked (e.g., 25/12,01/01,15/08).       | N/A, Optional         |

This table provides a clear and comprehensive overview of all the variables required and optional for configuring the Docker container. Users can easily reference this table to understand what each variable is used for and how to properly format their `.env` file for customizing the container's behavior to suit their needs.```

*Notes:*
- `PROXY` is optional and is only required for IP spoofing.
- `EXCLUDED_DAYS` specifies the days of the week when attendance should not be marked. Use abbreviations (Mon, Tue, Wed, Thu, Fri, Sat, Sun).
- `HOLIDAY_LIST` specifies dates in `dd/mm` format, separated by commas, on which the attendance should not be marked.

## Docker Container Setup (Docker Compose)

1. **Clone the Repository:**

```bash
git clone https://github.com/Ashesh3/zoho-auto-attendance
cd zoho-auto-attendance
```

2. **Rename the `.env.example` File:**

```bash
mv .env.example .env
```

3. **Edit the `.env` File:**

Update the `.env` file with your Zoho credentials and other configuration settings.

4. **Build and Run the Docker Container:**

```bash
docker-compose up -d
```

## Docker Container Setup (Docker CLI)

1. **Build the Docker Image:**

```bash
docker build -t zoho-attendance-auto .
```

2. **Run the Container:**

Ensure your `.env` file is ready with your configuration, then run:

```bash
docker run --env-file .env zoho-attendance-auto
```

## Manual Setup

1. **Clone the Repository:**

```bash
git clone https://github.com/Ashesh3/zoho-auto-attendance
cd zoho-auto-attendance
```

2. **Install Dependencies:**

```bash
yarn install
```

3. **Build the Project:**

```bash
yarn build
```

4. **Ensure Your `.env` File is Ready:**

Update the `.env` file with your Zoho credentials and other configuration settings.

5. **Run the Project:**

```bash
yarn start
```

## About the Project

This Docker container is designed for automated checking in and out of Zoho People, including optional location and IP spoofing. It provides a robust, deploy-anywhere solution that securely manages sensitive information.

The application now supports defining excluded days and a holiday list, ensuring it only operates on active workdays. This is especially useful for maintaining accurate attendance records without manual intervention during weekends and holidays.

### Important Note

Use this tool responsibly and in compliance with your organization's attendance policies and local laws. Misuse could result in disciplinary action or legal consequences.
