import { AttendanceMonthlyReport, CheckInResponse, CheckOutResponse, LoginResponse, PreLoginResponse } from "./types.js";
import { log } from "./utils.js";
import { CookieJar } from "tough-cookie";
import got from "got";
import { FormData } from "formdata-node";
import { HttpsProxyAgent } from "hpagent";

export class SessionManager {
  private cookieJar: CookieJar;
  private orgID: string;
  private proxyAgent: HttpsProxyAgent | undefined;

  constructor(orgID: string, proxy?: string) {
    this.cookieJar = new CookieJar();
    this.orgID = orgID;
    if (proxy)
      this.proxyAgent = new HttpsProxyAgent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256,
        scheduling: "lifo",
        proxy: proxy,
      });
  }

  async validateSession() {
    try {
      const csrfToken = this.cookieJar.getCookiesSync("https://peopleplus.zoho.in").find((cookie) => cookie.key === "_zcsr_tmp")?.value;
      if (!csrfToken) {
        log("ERROR", "Failed to extract csrf token; Cookies: " + JSON.stringify(this.cookieJar.toJSON()));
        return false;
      }

      const tokenCheckRes = await got.post(`https://peopleplus.zoho.in/${this.orgID}/widget.zp`, {
        agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
        headers: {
          Host: "peopleplus.zoho.in",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://peopleplus.zoho.in",
          Referer: `https://peopleplus.zoho.in/${this.orgID}/zp`,
        },
        form: {
          MODE: "GET_HEALTHFORM_CONFIG",
          conreqcsr: csrfToken,
        },
        cookieJar: this.cookieJar,
      });

      if (tokenCheckRes.statusCode !== 200) {
        log("ERROR", "Failed to validate session: " + tokenCheckRes.body);
        return false;
      }

      return true;
    } catch (e) {
      log("ERROR", "Failed to validate session: " + e);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const csrfToken = this.cookieJar.getCookiesSync("https://peopleplus.zoho.in").find((cookie) => cookie.key === "_zcsr_tmp")?.value;
      if (!csrfToken) {
        log("ERROR", "Failed to extract csrf token; Cookies: " + JSON.stringify(this.cookieJar.toJSON()));
        return null;
      }

      const getUserRes = await got.post(`https://peopleplus.zoho.in/${this.orgID}/AttendanceReportAction.zp`, {
        agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
        headers: {
          Host: "peopleplus.zoho.in",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://peopleplus.zoho.in",
          Referer: `https://peopleplus.zoho.in/${this.orgID}/zp`,
        },
        form: {
          mode: "getMonthReportForUser",
          conreqcsr: csrfToken,
        },
        cookieJar: this.cookieJar,
      });

      if (getUserRes.statusCode !== 200) {
        log("ERROR", "Failed to validate session: " + getUserRes.body);
        return false;
      }

      const report = JSON.parse(getUserRes.body) as AttendanceMonthlyReport;

      if (!report.weekDetails.noEnName) {
        log("ERROR", "Failed to get current user: " + JSON.stringify(report));
        return false;
      }

      return report.weekDetails.noEnName;
    } catch (e) {
      log("ERROR", "Failed to get current user: " + e);
      return false;
    }
  }

  async checkIn(latitude: string, longitude: string, accuracy: string) {
    try {
      const csrfToken = this.cookieJar.getCookiesSync("https://peopleplus.zoho.in").find((cookie) => cookie.key === "_zcsr_tmp")?.value;

      if (!csrfToken) {
        log("ERROR", "Failed to extract csrf token; Cookies: " + JSON.stringify(this.cookieJar.toJSON()));
        return false;
      }

      const checkInData = new FormData();
      checkInData.append("conreqcsr", csrfToken);
      checkInData.append("urlMode", "attendance_entry_listview");
      checkInData.append("latitude", latitude.toString());
      checkInData.append("longitude", longitude.toString());
      checkInData.append("accuracy", accuracy.toString());

      const checkInRes = await got.post(`https://peopleplus.zoho.in/${this.orgID}/AttendanceAction.zp?mode=punchIn`, {
        agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
        headers: {
          Host: "peopleplus.zoho.in",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://peopleplus.zoho.in",
          Referer: `https://peopleplus.zoho.in/${this.orgID}/zp`,
        },
        body: checkInData,
        cookieJar: this.cookieJar,
      });

      if (checkInRes.statusCode !== 200) {
        log("ERROR", "Failed to check in: " + checkInRes.body);
        return false;
      }

      const checkInResponse = JSON.parse(checkInRes.body) as CheckInResponse;

      if (!checkInResponse?.msg?.currentPunchinAttenId) {
        log("ERROR", "Failed to check in: " + JSON.stringify(checkInResponse));
        return false;
      }
      return true;
    } catch (e) {
      log("ERROR", "Failed to check in: " + e);
      return false;
    }
  }

  async checkOut(latitude: string, longitude: string, accuracy: string) {
    try {
      const csrfToken = this.cookieJar.getCookiesSync("https://peopleplus.zoho.in").find((cookie) => cookie.key === "_zcsr_tmp")?.value;

      if (!csrfToken) {
        log("ERROR", "Failed to extract csrf token; Cookies: " + JSON.stringify(this.cookieJar.toJSON()));
        return false;
      }

      const checkOutData = new FormData();
      checkOutData.append("conreqcsr", csrfToken);
      checkOutData.append("urlMode", "attendance_entry_listview");
      checkOutData.append("latitude", latitude.toString());
      checkOutData.append("longitude", longitude.toString());
      checkOutData.append("accuracy", accuracy.toString());

      const checkOutRes = await got.post(`https://peopleplus.zoho.in/${this.orgID}/AttendanceAction.zp?mode=punchOut`, {
        agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
        headers: {
          Host: "peopleplus.zoho.in",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://peopleplus.zoho.in",
          Referer: `https://peopleplus.zoho.in/${this.orgID}/zp`,
        },
        body: checkOutData,
        cookieJar: this.cookieJar,
      });

      if (checkOutRes.statusCode !== 200) {
        log("ERROR", "Failed to check in: " + checkOutRes.body);
        return false;
      }

      const checkInResponse = JSON.parse(checkOutRes.body) as CheckOutResponse;

      if (!checkInResponse?.punchOut?.tdate) {
        log("ERROR", "Failed to check in: " + JSON.stringify(checkInResponse));
        return false;
      }
      return true;
    } catch (e) {
      log("ERROR", "Failed to check in: " + e);
      return false;
    }
  }

  clearSession() {
    this.cookieJar.removeAllCookiesSync();
  }

  async login(email: string, password: string) {
    log("INFO", "Logging in...");
    log("INFO", "Fetching cookies...");
    const cookieFetchResponse = await got.get(
      "https://accounts.zoho.in/signin?servicename=Peopleplus&signupurl=https://www.zoho.in/peopleplus/signup.html",
      {
        agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
        headers: {
          Host: "accounts.zoho.in",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Referer: "https://www.zoho.com/",
        },
        cookieJar: this.cookieJar,
      }
    );

    if (cookieFetchResponse.statusCode !== 200) {
      log("ERROR", "Failed to fetch cookies: " + cookieFetchResponse.statusCode + " " + cookieFetchResponse.body);
      return false;
    }

    const iamcsrCookie = this.cookieJar.getCookiesSync("https://accounts.zoho.in").find((cookie) => cookie.key === "iamcsr")?.value;
    if (!iamcsrCookie) {
      log("ERROR", "Failed to extract iamcsr cookie; Cookies: " + JSON.stringify(this.cookieJar.toJSON()));
      return false;
    }
    log("INFO", "Performing pre-login...");
    const preLoginResponse = await got.post(`https://accounts.zoho.in/signin/v2/lookup/${email}`, {
      agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
      headers: {
        Host: "accounts.zoho.in",
        "X-Zcsrf-Token": "iamcsrcoo=" + iamcsrCookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Origin: "https://accounts.zoho.in",
        Referer: "https://accounts.zoho.in/signin?servicename=Peopleplus&signupurl=https://www.zoho.in/peopleplus/signup.html",
      },
      form: {
        mode: "primary",
        cli_time: new Date().getTime().toString(),
        servicename: "Peopleplus",
        signupurl: "https://www.zoho.in/peopleplus/signup.html",
        serviceurl: "https://peopleplus.zoho.in/",
      },
      cookieJar: this.cookieJar,
    });

    if (preLoginResponse.statusCode !== 200) {
      log("ERROR", "Failed to pre-login: " + preLoginResponse.statusCode + " " + preLoginResponse.body);
      return false;
    }

    const lookupResults = JSON.parse(preLoginResponse.body) as PreLoginResponse;

    if (lookupResults.status_code !== 201) {
      log("ERROR", "Failed to lookup email: " + JSON.stringify(lookupResults));
      return false;
    }
    log("INFO", "Logging in...");
    const loginRes = await got.post(
      `https://accounts.zoho.in/signin/v2/primary/${lookupResults.lookup.identifier}/password?digest=${lookupResults.lookup.digest}&cli_time=&servicename=Peopleplus&signupurl=https%3A%2F%2Fwww.zoho.in%2Fpeopleplus%2Fsignup.html&serviceurl=https%3A%2F%2Fpeopleplus.zoho.in%2F`,
      {
        agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
        method: "POST",
        headers: {
          Host: "accounts.zoho.in",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-Zcsrf-Token": "iamcsrcoo=" + iamcsrCookie,
          Origin: "https://accounts.zoho.in",
          Referer: "https://accounts.zoho.in/signin?servicename=Peopleplus&signupurl=https://www.zoho.in/peopleplus/signup.html",
        },
        body: `{"passwordauth":{"password":"${password}"}}`,
        cookieJar: this.cookieJar,
      }
    );

    if (loginRes.statusCode !== 200) {
      log("ERROR", "Failed to login: " + loginRes.statusCode + " " + loginRes.body);
      return false;
    }

    const loginResponse = JSON.parse(loginRes.body) as LoginResponse;

    if (loginResponse.status_code !== 201) {
      log("ERROR", "Failed to login: " + JSON.stringify(loginResponse));
      return false;
    }

    await got.get("https://peopleplus.zoho.in/", {
      agent: this.proxyAgent ? { https: this.proxyAgent } : undefined,
      headers: {
        Host: "peopleplus.zoho.in",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://accounts.zoho.in/signin?servicename=Peopleplus&signupurl=https://www.zoho.in/peopleplus/signup.html",
      },
      cookieJar: this.cookieJar,
    });

    log("INFO", "Logged in successfully");
    return true;
  }
}
