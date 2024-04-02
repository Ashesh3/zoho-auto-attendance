import * as dotenv from "dotenv";
import { CronJob } from "cron";
import { generateCronExpression, log } from "./utils.js";
import { SessionManager } from "./session.js";

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

  const check_in_cron = new CronJob(
    generateCronExpression(check_in_time, excluded_days),
    async () => {
      if (holiday_list?.includes(new Date().toISOString().split("T")[0])) {
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
      }
      log(
        "INFO",
        "Checked in successfully. Next check-in at: " +
          check_in_cron.nextDate().toLocaleString({
            timeZone: timezone,
            dateStyle: "short",
            timeStyle: "long",
          })
      );
    },
    null,
    true,
    timezone
  );
  log(
    "INFO",
    "Check-in cron job scheduled. Next check-in at: " +
      check_in_cron.nextDate().toLocaleString({
        timeZone: timezone,
        dateStyle: "short",
        timeStyle: "long",
      })
  );

  const check_out_cron = new CronJob(
    generateCronExpression(check_out_time, excluded_days),
    async () => {
      if (holiday_list?.includes(new Date().toISOString().split("T")[0])) {
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
      }
      log(
        "INFO",
        "Checked out successfully. Next check-out at: " +
          check_out_cron.nextDate().toLocaleString({
            timeZone: timezone,
            dateStyle: "short",
            timeStyle: "long",
          })
      );
    },
    null,
    true,
    timezone
  );
  log(
    "INFO",
    "Check-out cron job scheduled. Next check-out at: " +
      check_out_cron.nextDate().toLocaleString({
        timeZone: timezone,
        dateStyle: "short",
        timeStyle: "long",
      })
  );
})();
