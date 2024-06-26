import * as dotenv from "dotenv";
import { CronJob } from "cron";
import { generateCronExpression, log } from "./utils.js";
import { SessionManager } from "./session.js";
import { DateTime } from "luxon";

dotenv.config();

const email = process.env.ZOHO_EMAIL;
const password = process.env.ZOHO_PASSWORD;
const check_in_time = process.env.CHECK_IN_TIME;
const check_out_time = process.env.CHECK_OUT_TIME;
const timezone = process.env.TIMEZONE || "Asia/Kolkata";
const orgId = process.env.ZOHO_ORG_ID;
const latitude = process.env.ATTENDANCE_LATITUDE;
const longitude = process.env.ATTENDANCE_LONGITUDE;
const accuracy = process.env.LOCATION_ACCURACY_METERS ?? "500";
const excluded_days = process.env.EXCLUDED_DAYS?.split(",")?.map((day) => day?.toLowerCase()?.trim()) || [];
const holiday_list = process.env.HOLIDAY_LIST?.split(",")?.map((date) => date?.toLowerCase()?.trim());
const proxy = process.env.PROXY;

if (!email || !password || !check_in_time || !check_out_time || !orgId || !latitude || !longitude || !accuracy) {
  log("ERROR", "Missing required environment variables");
  process.exit(1);
}

log("INFO", "Environment variables loaded successfully");

log("INFO", "Email: " + email);
log("INFO", "Check-in time: " + check_in_time);
log("INFO", "Check-out time: " + check_out_time);
log("INFO", "Timezone: " + timezone);
log("INFO", "Organization ID: " + orgId);
log("INFO", "Latitude: " + latitude);
log("INFO", "Longitude: " + longitude);
log("INFO", "Location accuracy: " + accuracy);
log("INFO", "Excluded days: " + (excluded_days ?? "None"));
log("INFO", "Holiday list: " + (holiday_list ?? "None"));
log("INFO", "Proxy: " + (proxy ?? "None"));

(async () => {
  const session_manager = new SessionManager(orgId);
  if (!(await session_manager.login(email, password))) {
    log("ERROR", "Failed to login");
    process.exit(1);
  }

  log("INFO", "Logged in as " + (await session_manager.getCurrentUser()));
  const check_in_cron_exp = generateCronExpression(check_in_time, excluded_days);
  log("INFO", "Check-in cron expression: " + check_in_cron_exp);

  const check_in_cron = new CronJob(
    check_in_cron_exp,
    async () => {
      if (holiday_list?.includes(DateTime.now().setZone(timezone).toFormat("dd/LL"))) {
        log("INFO", "Today is a holiday");
        return;
      }

      log("INFO", "Checking Session Validity...");

      if (!(await session_manager.validateSession())) {
        log("ERROR", "Failed to validate session. Re-logging in...");
        if (!(await session_manager.login(email, password))) {
          log("ERROR", "Failed to login");
          return;
        }
        log("INFO", "Logged in as " + (await session_manager.getCurrentUser()));
      } else {
        log("INFO", "Session Already Valid");
      }

      log("INFO", "Checking in...");

      if (!(await session_manager.checkIn(latitude, longitude, accuracy))) {
        log("ERROR", "Failed to check in");
        log("INFO", "Trying to refresh session...");

        if (!(await session_manager.login(email, password))) {
          log("ERROR", "Failed to refresh session");
          return;
        }

        log("INFO", "Session refreshed successfully");
        log("INFO", "Checking in again...");

        if (!(await session_manager.checkIn(latitude, longitude, accuracy))) {
          log("ERROR", "Attempt 2: Failed to check in");
          return;
        }
      }

      log(
        "INFO",
        "Checked in successfully. Next check-in at: " +
          check_in_cron.nextDate().setZone(timezone).toLocaleString(DateTime.DATETIME_MED) +
          " (Unless it's a holiday)"
      );
    },
    null,
    true,
    timezone
  );
  log(
    "INFO",
    "Check-in cron job scheduled. Next check-in at: " +
      check_in_cron.nextDate().setZone(timezone).toLocaleString(DateTime.DATETIME_MED) +
      " (Unless it's a holiday)"
  );

  log("INFO", "Logged in as " + (await session_manager.getCurrentUser()));
  const check_out_cron_exp = generateCronExpression(check_out_time, excluded_days);
  log("INFO", "Check-in cron expression: " + check_in_cron_exp);

  const check_out_cron = new CronJob(
    check_out_cron_exp,
    async () => {
      if (holiday_list?.includes(DateTime.now().setZone(timezone).toFormat("dd/LL"))) {
        log("INFO", "Today is a holiday");
        return;
      }

      log("INFO", "Checking Session Validity...");

      if (!(await session_manager.validateSession())) {
        log("ERROR", "Failed to validate session. Re-logging in...");
        if (!(await session_manager.login(email, password))) {
          log("ERROR", "Failed to login");
          return;
        }
        log("INFO", "Logged in as " + (await session_manager.getCurrentUser()));
      } else {
        log("INFO", "Session Already Valid");
      }

      log("INFO", "Checking out...");

      if (!(await session_manager.checkOut(latitude, longitude, accuracy))) {
        log("ERROR", "Failed to check out");
        log("INFO", "Trying to refresh session...");

        if (!(await session_manager.login(email, password))) {
          log("ERROR", "Failed to refresh session");
          return;
        }

        log("INFO", "Session refreshed successfully");
        log("INFO", "Checking out again...");

        if (!(await session_manager.checkOut(latitude, longitude, accuracy))) {
          log("ERROR", "Attempt 2: Failed to check out");
          return;
        }
      }

      log(
        "INFO",
        "Checked out successfully. Next check-out at: " +
          check_out_cron.nextDate().setZone(timezone).toLocaleString(DateTime.DATETIME_MED) +
          " (Unless it's a holiday)"
      );
    },
    null,
    true,
    timezone
  );
  log(
    "INFO",
    "Check-out cron job scheduled. Next check-out at: " +
      check_out_cron.nextDate().setZone(timezone).toLocaleString(DateTime.DATETIME_MED) +
      " (Unless it's a holiday)"
  );
})();
